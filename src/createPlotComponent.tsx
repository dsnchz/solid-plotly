import { tryCatch } from "@dschz/try-catch";
import type { PlotlyHTMLElement } from "plotly.js";
import {
  createEffect,
  createSignal,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
} from "solid-js";

import { PLOT_COMPONENT_EVENT_NAMES } from "./constants";
import type {
  PlotComponentEventHandlers,
  PlotlyConfig,
  PlotlyData,
  PlotlyFrame,
  PlotlyLayout,
  UpdateFigureCallback,
} from "./types";
import { attachComponentEvents, getFigureData, removeComponentEvents } from "./utils";

/**
 * Props interface for the Plot component created by createPlotComponent.
 *
 * Combines all Plotly event handlers with component-specific props for data visualization.
 * All props except `data` are optional, allowing for flexible usage patterns.
 *
 * @example
 * ```tsx
 * const Plot = createPlotComponent(Plotly);
 *
 * <Plot
 *   data={[{ x: [1, 2, 3], y: [1, 4, 2], type: 'scatter' }]}
 *   layout={{ title: 'My Chart' }}
 *   onClick={(event) => console.log('Clicked:', event.points)}
 *   useResize={true}
 * />
 * ```
 */
export type PlotProps = PlotComponentEventHandlers & {
  /** Unique identifier for the plot container element @default "solid-plotly" */
  readonly id?: string;
  /** CSS class name(s) to apply to the plot container @default undefined */
  readonly class?: string;
  /** Inline CSS styles for the plot container @default { position: "relative", display: "inline-block" } */
  readonly style?: JSX.CSSProperties;
  /** Plotly configuration options for plot behavior and appearance @default {} */
  readonly config?: PlotlyConfig;
  /** Array of data traces to be plotted (required) @default [] */
  readonly data: PlotlyData[];
  /** Animation frames for animated plots @default [] */
  readonly frames?: PlotlyFrame[];
  /** Layout configuration for axes, title, margins, etc. @default {} */
  readonly layout?: PlotlyLayout;
  /** Callback fired when the plot is first initialized @default undefined */
  readonly onInitialized?: UpdateFigureCallback;
  /** Callback fired when the plot is purged/destroyed @default undefined */
  readonly onPurge?: UpdateFigureCallback;
  /** Callback fired when the plot data/layout is updated @default undefined */
  readonly onUpdate?: UpdateFigureCallback;
  /** Callback fired when the plot is resized (only when useResize is true) @default undefined */
  readonly onResize?: () => void;
  /** Callback fired when an error occurs during plot operations @default undefined */
  readonly onError?: (e: Error) => void;
  /** Ref callback to access the underlying HTML div element @default undefined */
  readonly ref?: (el: HTMLDivElement) => void;
  /** Enable automatic plot resizing when container size changes @default true */
  readonly useResize?: boolean;
};

/**
 * Subset of Plotly.js module interface required by the component.
 *
 * This type ensures that only the necessary Plotly.js functions are used,
 * allowing for tree-shaking and compatibility with different Plotly.js bundles.
 *
 * @example
 * ```tsx
 * import Plotly from 'plotly.js-dist-min';
 * import { createPlotComponent } from '@dschz/solid-plotly';
 *
 * const Plot = createPlotComponent(Plotly);
 * ```
 */
export type PlotlyModule = Pick<
  typeof import("plotly.js"),
  "newPlot" | "react" | "purge" | "Plots"
>;

/**
 * Factory function that creates a Plot component bound to a specific Plotly.js module.
 *
 * This approach allows users to choose their preferred Plotly.js bundle (full, basic, minimal)
 * while keeping the library agnostic to specific Plotly.js dependencies.
 *
 * @param Plotly - Plotly.js module containing required methods (newPlot, react, purge, Plots)
 * @returns A SolidJS component that renders interactive Plotly charts
 *
 * @example
 * ```tsx
 * import Plotly from 'plotly.js-dist-min';
 * import { createPlotComponent } from '@dschz/solid-plotly';
 *
 * const Plot = createPlotComponent(Plotly);
 *
 * function MyChart() {
 *   const data = [{ x: [1, 2, 3], y: [1, 4, 2], type: 'scatter' }];
 *   return <Plot data={data} useResize={true} />;
 * }
 * ```
 *
 * @remarks
 * - The returned component uses SolidJS fine-grained reactivity for optimal performance
 * - Automatically handles plot initialization, updates, and cleanup
 * - Supports all Plotly.js event handlers through props
 * - Includes built-in resize handling when useResize is enabled
 */
export const createPlotComponent =
  (Plotly: PlotlyModule) =>
  (props: PlotProps): JSX.Element => {
    const _props = mergeProps(
      {
        id: "solid-plotly",
        config: {} as PlotlyConfig,
        data: [] as PlotlyData[],
        frames: [] as PlotlyFrame[],
        layout: {} as PlotlyLayout,
        useResize: true,
        style: {
          position: "relative",
          display: "inline-block",
        } as JSX.CSSProperties,
      },
      props,
    );

    let container!: HTMLElement;
    let plotElement!: PlotlyHTMLElement;
    const [initialized, setInitialized] = createSignal(false);

    const [containerProps] = splitProps(_props, ["id", "class", "style", "ref"]);
    const [eventProps] = splitProps(_props, PLOT_COMPONENT_EVENT_NAMES);
    const [plotProps] = splitProps(_props, [
      "data",
      "layout",
      "config",
      "onInitialized",
      "onPurge",
      "onUpdate",
      "onError",
      "onResize",
      "useResize",
    ]);

    const layout = () =>
      plotProps.useResize ? { ...plotProps.layout, autosize: true } : plotProps.layout;

    const config = () =>
      plotProps.useResize ? { ...plotProps.config, responsive: true } : plotProps.config;

    onMount(async () => {
      const [error, element] = await tryCatch(
        Plotly.newPlot(container, plotProps.data, layout(), config()),
      );

      if (error) {
        plotProps.onError?.(error);
        return;
      }

      Plotly.Plots.resize(element);
      attachComponentEvents(element, eventProps);

      plotProps.onInitialized?.(getFigureData(element), element);
      plotElement = element;

      setInitialized(true);
    });

    createEffect(() => {
      if (!initialized()) return;

      const updatePlot = async () => {
        const [error, element] = await tryCatch(
          Plotly.react(container, plotProps.data, layout(), config()),
        );

        if (error) {
          plotProps.onError?.(error);
          return;
        }

        plotProps.onUpdate?.(getFigureData(element), element);
      };

      void updatePlot();
    });

    createEffect(() => {
      if (!initialized() || !plotProps.useResize) return;

      const resizeHandler = () => {
        Plotly.Plots.resize(plotElement);
        plotProps.onResize?.();
      };

      const resizeObserver = new ResizeObserver(resizeHandler);
      resizeObserver.observe(container);

      onCleanup(() => {
        resizeObserver.disconnect();
      });
    });

    onCleanup(() => {
      if (!initialized()) return;

      removeComponentEvents(plotElement, eventProps);
      Plotly.purge(plotElement);
      plotProps.onPurge?.(getFigureData(plotElement), plotElement);

      setInitialized(false);
    });

    return (
      <div
        id={containerProps.id}
        class={containerProps.class}
        style={containerProps.style}
        ref={(el) => {
          container = el;
          containerProps.ref?.(el);
        }}
      />
    );
  };
