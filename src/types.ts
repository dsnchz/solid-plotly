import type {
  ClickAnnotationEvent,
  FrameAnimationEvent,
  LegendClickEvent,
  PlotHoverEvent,
  PlotlyHTMLElement,
  PlotMouseEvent,
  PlotRelayoutEvent,
  PlotRestyleEvent,
  PlotSelectionEvent,
  SliderChangeEvent,
  SliderEndEvent,
  SliderStartEvent,
  SunburstClickEvent,
} from "plotly.js";

import { PLOT_COMPONENT_EVENT_NAMES, PLOTLY_EVENT_NAMES } from "./constants";

/**
 * Plotly configuration object type.
 *
 * Defines options for plot behavior, appearance, and interaction settings.
 * This is a partial type of Plotly.Config, allowing any subset of configuration options.
 *
 * @example
 * ```tsx
 * const config: PlotlyConfig = {
 *   displayModeBar: true,
 *   responsive: true,
 *   toImageButtonOptions: {
 *     format: 'png',
 *     filename: 'custom_image'
 *   }
 * };
 * ```
 */
export type PlotlyConfig = Partial<Plotly.Config>;

/**
 * Single data trace type for Plotly charts.
 *
 * Represents one data series/trace that can be plotted. Multiple PlotlyData objects
 * make up the data array passed to a chart.
 *
 * @example
 * ```tsx
 * const trace: PlotlyData = {
 *   x: [1, 2, 3, 4],
 *   y: [10, 11, 12, 13],
 *   type: 'scatter',
 *   mode: 'lines+markers',
 *   name: 'Sample Data'
 * };
 * ```
 */
export type PlotlyData = Plotly.Data;

/**
 * Animation frame type for animated Plotly charts.
 *
 * Used to define individual frames in animated visualizations, allowing for
 * smooth transitions between different states of data.
 *
 * @example
 * ```tsx
 * const frame: PlotlyFrame = {
 *   name: 'frame1',
 *   data: [{ x: [1, 2], y: [1, 4] }],
 *   layout: { title: 'Frame 1' }
 * };
 * ```
 */
export type PlotlyFrame = Plotly.Frame;

/**
 * Plotly layout configuration type.
 *
 * Defines the overall appearance and structure of the plot including axes,
 * titles, margins, colors, and other visual elements. This is a partial type
 * allowing any subset of layout options.
 *
 * @example
 * ```tsx
 * const layout: PlotlyLayout = {
 *   title: 'My Chart Title',
 *   xaxis: { title: 'X Axis' },
 *   yaxis: { title: 'Y Axis' },
 *   margin: { t: 50, l: 50, r: 50, b: 50 }
 * };
 * ```
 */
export type PlotlyLayout = Partial<Plotly.Layout>;

export type PlotComponentEventName = (typeof PLOT_COMPONENT_EVENT_NAMES)[number];
export type PlotlyEventName = (typeof PLOTLY_EVENT_NAMES)[number];

export type VoidHandler = () => void;

/**
 * Complete interface for all Plotly event handlers supported by the component.
 *
 * Provides type-safe event handling for all Plotly.js events including mouse interactions,
 * selections, layout changes, UI element interactions, and plot lifecycle events.
 * All event handlers are optional.
 *
 * @example
 * ```tsx
 * const eventHandlers: Partial<PlotComponentEventHandlers> = {
 *   onClick: (event) => console.log('Point clicked:', event.points[0]),
 *   onHover: (event) => console.log('Hovering over:', event.points[0]),
 *   onRelayout: (event) => console.log('Layout changed:', event),
 *   onSelected: (event) => console.log('Points selected:', event.points)
 * };
 * ```
 *
 * @remarks
 * Event handlers are organized into several categories:
 * - **Mouse Events**: onClick, onDoubleClick, onHover, onUnhover
 * - **Selection Events**: onSelected, onSelecting, onDeselect
 * - **Layout Events**: onRelayout, onRelayouting, onRestyle
 * - **Legend Events**: onLegendClick, onLegendDoubleClick
 * - **UI Events**: onClickAnnotation, onSliderChange, onSliderStart, onSliderEnd
 * - **Lifecycle Events**: onAfterPlot, onBeforePlot, onRedraw, onAutoSize
 * - **Animation Events**: onAnimated, onAnimatingFrame, onTransitioning
 */
export type PlotComponentEventHandlers = {
  /** Fired when an animation frame is being processed */
  onAnimatingFrame?: (event: FrameAnimationEvent) => void;
  /** Fired before plot rendering begins - return false to cancel */
  onBeforePlot?: (event: Event) => boolean;
  /** Fired when a data point is clicked */
  onClick?: (event: PlotMouseEvent) => void;
  /** Fired when an annotation is clicked */
  onClickAnnotation?: (event: ClickAnnotationEvent) => void;
  /** Fired when hovering over a data point */
  onHover?: (event: PlotHoverEvent) => void;
  /** Fired when a legend item is clicked - return false to prevent default behavior */
  onLegendClick?: (event: LegendClickEvent) => boolean;
  /** Fired when a legend item is double-clicked - return false to prevent default behavior */
  onLegendDoubleClick?: (event: LegendClickEvent) => boolean;
  /** Fired when the plot layout is changed (zoom, pan, resize) */
  onRelayout?: (event: PlotRelayoutEvent) => void;
  /** Fired continuously while the layout is being changed */
  onRelayouting?: (event: PlotRelayoutEvent) => void;
  /** Fired when plot styling properties are changed */
  onRestyle?: (data: PlotRestyleEvent) => void;
  /** Fired when data points are selected */
  onSelected?: (event: PlotSelectionEvent) => void;
  /** Fired continuously while selecting data points */
  onSelecting?: (event: PlotSelectionEvent) => void;
  /** Fired when a slider value is changed */
  onSliderChange?: (event: SliderChangeEvent) => void;
  /** Fired when slider interaction ends */
  onSliderEnd?: (event: SliderEndEvent) => void;
  /** Fired when slider interaction starts */
  onSliderStart?: (event: SliderStartEvent) => void;
  /** Fired when a sunburst chart segment is clicked */
  onSunburstClick?: (event: SunburstClickEvent) => void;
  /** Fired when mouse leaves a data point */
  onUnhover?: (event: PlotMouseEvent) => void;

  /** Fired after export operation completes */
  onAfterExport?: VoidHandler;
  /** Fired after plot rendering completes */
  onAfterPlot?: VoidHandler;
  /** Fired after animation completes */
  onAnimated?: VoidHandler;
  /** Fired when animation is interrupted */
  onAnimationInterrupted?: VoidHandler;
  /** Fired when plot auto-resizes */
  onAutoSize?: VoidHandler;
  /** Fired before export operation begins */
  onBeforeExport?: VoidHandler;
  /** Fired when selection is cleared */
  onDeselect?: VoidHandler;
  /** Fired when plot is double-clicked */
  onDoubleClick?: VoidHandler;
  /** Fired for framework-specific events */
  onFramework?: VoidHandler;
  /** Fired when plot is redrawn */
  onRedraw?: VoidHandler;
  /** Fired during plot transitions */
  onTransitioning?: VoidHandler;
  /** Fired when transition is interrupted */
  onTransitionInterrupted?: VoidHandler;

  /** Generic event handler for any plot event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent?: (data: any) => void;
};

/**
 * Complete plot figure data structure containing all plot information.
 *
 * Represents the full state of a Plotly chart including data traces, layout configuration,
 * and animation frames. This type is used in lifecycle callbacks to provide access
 * to the complete plot state.
 *
 * @example
 * ```tsx
 * const onInitialized = (figure: PlotlyFigure, element: PlotlyHTMLElement) => {
 *   console.log('Plot initialized with', figure.data.length, 'traces');
 *   console.log('Title:', figure.layout.title);
 *   if (figure.frames) {
 *     console.log('Animation frames:', figure.frames.length);
 *   }
 * };
 * ```
 */
export type PlotlyFigure = {
  /** Array of data traces in the plot */
  readonly data: Plotly.Data[];
  /** Layout configuration of the plot */
  readonly layout: Partial<Plotly.Layout>;
  /** Animation frames if present, null otherwise */
  readonly frames: Plotly.Frame[] | null;
};

export type UpdateFigureCallback = (figure: PlotlyFigure, el: PlotlyHTMLElement) => void;
