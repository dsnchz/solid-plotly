<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Ecosystem&background=tiles&project=solid-plotly" alt="solid-plotly">
</p>

# @dschz/solid-plotly

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm](https://img.shields.io/npm/v/@dschz/solid-plotly?color=blue)](https://www.npmjs.com/package/@dschz/solid-plotly)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@dschz/solid-plotly)](https://bundlephobia.com/package/@dschz/solid-plotly)
[![JSR](https://jsr.io/badges/@dschz/solid-plotly/score)](https://jsr.io/@dschz/solid-plotly)
[![CI](https://github.com/dsnchz/solid-plotly/actions/workflows/ci.yaml/badge.svg)](https://github.com/dsnchz/solid-plotly/actions/workflows/ci.yaml)
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?logo=discord&logoColor=white)](https://discord.gg/XUVHnhsHKK)

> A modern, type-safe SolidJS component for [Plotly.js](https://plotly.com/javascript/) charts with fine-grained reactivity and full event support.

## ✨ Features

- 🏭 **Factory Pattern** - Plotly-agnostic design, bring your own Plotly.js bundle
- ⚡ **SolidJS Reactivity** - Fine-grained reactive updates for optimal performance
- 📱 **Responsive by Default** - Automatic resizing with ResizeObserver
- 🎯 **Full TypeScript Support** - Complete type safety with comprehensive JSDoc
- 🎪 **30+ Event Handlers** - All official Plotly.js events supported

## Contents

- [Installation](#installation)
- [Plotly.js Distribution](#plotlyjs-distribution)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Factory Function](#factory-function)
  - [Component Props](#component-props)
  - [Event Handlers](#event-handlers)
- [Examples](#examples)
- [Customizing Plotly.js Bundle](#customizing-plotlyjs-bundle)
- [TypeScript Usage](#typescript-usage)
- [Development](#development)

## Installation

```bash
npm install solid-js @dschz/solid-plotly
# or
pnpm add solid-js @dschz/solid-plotly
# or
yarn add solid-js @dschz/solid-plotly
# or
bun add solid-js @dschz/solid-plotly
```

## Plotly.js Distribution

**Important**: You must also install a Plotly.js distribution that suits your needs. This library is designed to be Plotly-agnostic, allowing you to choose the which PLotly distribution is optimal for the needs of your application.

### For Web Applications (Recommended)

```bash
npm install plotly.js-dist-min
```

### Other Available Distributions

```bash
# Full bundle (~3MB) - All chart types and features
npm install plotly.js-dist

# Basic bundle (~1MB) - Common chart types (scatter, bar, line, pie, etc.)
npm install plotly.js-basic-dist

# Minimal bundle (~400KB) - Essential charts only
npm install plotly.js-dist-min

# Custom build - Advanced users who want to cherry-pick modules
npm install plotly.js
```

## Quick Start

Create a Plot component using the factory function with your chosen Plotly.js bundle:

```tsx
import { createSignal } from "solid-js";
import Plotly from "plotly.js-dist-min";
import { createPlotComponent } from "@dschz/solid-plotly";

// Create the Plot component bound to your Plotly module
const Plot = createPlotComponent(Plotly);

function App() {
  return (
    <Plot
      data={[
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "red" },
        },
        { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
      ]}
      layout={{ title: "My First Chart" }}
      onClick={(event) => console.log("Clicked:", event.points)}
    />
  );
}
```

## API Reference

### Factory Function

#### `createPlotComponent(Plotly: PlotlyModule)`

Creates a Plot component bound to a specific Plotly.js module.

**Parameters:**

- `Plotly` - Plotly.js module with required methods: `newPlot`, `react`, `purge`, `Plots`

**Returns:** SolidJS component for rendering Plotly charts

```tsx
import Plotly from "plotly.js-basic-dist";
import { createPlotComponent } from "@dschz/solid-plotly";

const Plot = createPlotComponent(Plotly);
```

### Component Props

| Prop            | Type                           | Default                                             | Description                                                |
| --------------- | ------------------------------ | --------------------------------------------------- | ---------------------------------------------------------- |
| `data`          | `PlotlyData[]`                 | `[]`                                                | Array of data traces to plot _(required)_                  |
| `layout`        | `PlotlyLayout`                 | `{}`                                                | Layout configuration for axes, title, margins, etc.        |
| `config`        | `PlotlyConfig`                 | `{}`                                                | Plotly configuration options for behavior and appearance   |
| `frames`        | `PlotlyFrame[]`                | `[]`                                                | Animation frames for animated plots                        |
| `useResize`     | `boolean`                      | `true`                                              | Enable automatic plot resizing when container size changes |
| `id`            | `string`                       | `"solid-plotly"`                                    | Unique identifier for the plot container element           |
| `class`         | `string`                       | `undefined`                                         | CSS class name(s) to apply to the plot container           |
| `style`         | `JSX.CSSProperties`            | `{ position: "relative", display: "inline-block" }` | Inline CSS styles for the plot container                   |
| `onInitialized` | `(figure, element) => void`    | `undefined`                                         | Callback fired when the plot is first initialized          |
| `onUpdate`      | `(figure, element) => void`    | `undefined`                                         | Callback fired when the plot data/layout is updated        |
| `onPurge`       | `(figure, element) => void`    | `undefined`                                         | Callback fired when the plot is purged/destroyed           |
| `onResize`      | `() => void`                   | `undefined`                                         | Callback fired when the plot is resized                    |
| `onError`       | `(error) => void`              | `undefined`                                         | Callback fired when an error occurs during plot operations |
| `ref`           | `(el: HTMLDivElement) => void` | `undefined`                                         | Ref callback to access the underlying HTML div element     |

### Event Handlers

The component supports all official Plotly.js events through props. All event handlers are optional:

#### Mouse & Interaction Events

- `onClick` - Fired when a data point is clicked
- `onDoubleClick` - Fired when plot is double-clicked
- `onHover` - Fired when hovering over a data point
- `onUnhover` - Fired when mouse leaves a data point

#### Selection Events

- `onSelected` - Fired when data points are selected
- `onSelecting` - Fired continuously while selecting data points
- `onDeselect` - Fired when selection is cleared

#### Layout Events

- `onRelayout` - Fired when the plot layout is changed (zoom, pan, resize)
- `onRelayouting` - Fired continuously while the layout is being changed
- `onRestyle` - Fired when plot styling properties are changed

#### Legend Events

- `onLegendClick` - Fired when a legend item is clicked
- `onLegendDoubleClick` - Fired when a legend item is double-clicked

#### UI Element Events

- `onClickAnnotation` - Fired when an annotation is clicked
- `onSliderChange` - Fired when a slider value is changed
- `onSliderStart` - Fired when slider interaction starts
- `onSliderEnd` - Fired when slider interaction ends

#### Plot Lifecycle Events

- `onAfterPlot` - Fired after plot rendering completes
- `onBeforePlot` - Fired before plot rendering begins
- `onRedraw` - Fired when plot is redrawn
- `onAutoSize` - Fired when plot auto-resizes

#### Animation Events

- `onAnimated` - Fired after animation completes
- `onAnimatingFrame` - Fired when an animation frame is being processed
- `onAnimationInterrupted` - Fired when animation is interrupted
- `onTransitioning` - Fired during plot transitions
- `onTransitionInterrupted` - Fired when transition is interrupted

#### Export Events

- `onAfterExport` - Fired after export operation completes
- `onBeforeExport` - Fired before export operation begins

#### Framework Events

- `onFramework` - Fired for framework-specific events
- `onSunburstClick` - Fired when a sunburst chart segment is clicked
- `onEvent` - Generic event handler for any plot event

## Examples

### Reactive Data Updates

```tsx
import { createSignal } from "solid-js";
import Plotly from "plotly.js-dist-min";
import { createPlotComponent, type PlotlyData } from "@dschz/solid-plotly";

const Plot = createPlotComponent(Plotly);

function ReactivePlot() {
  const [data, setData] = createSignal<PlotlyData[]>([
    { x: [1, 2, 3], y: [1, 4, 2], type: "scatter" },
  ]);

  const addPoint = () => {
    setData((prev) => [
      {
        ...prev[0],
        x: [...prev[0].x, prev[0].x.length + 1],
        y: [...prev[0].y, Math.random() * 10],
      },
    ]);
  };

  return (
    <div>
      <button onClick={addPoint}>Add Point</button>
      <Plot data={data()} layout={{ title: "Reactive Updates" }} />
    </div>
  );
}
```

### Event Handling

```tsx
import { createSignal } from "solid-js";
import type { PlotSelectionEvent } from "plotly.js";
import { createPlotComponent, type PlotlyData, type PlotlyLayout } from "@dschz/solid-plotly";

const Plot = createPlotComponent(Plotly);

function InteractivePlot() {
  const [selectedPoints, setSelectedPoints] = createSignal<PlotSelectionEvent["points"]>([]);
  const [data] = createSignal<PlotlyData[]>([
    { x: [1, 2, 3, 4], y: [10, 11, 12, 13], type: "scatter" },
  ]);
  const [layout] = createSignal<PlotlyLayout>({ title: "Click and Select Points" });

  return (
    <Plot
      data={data()}
      layout={layout()}
      onClick={(event) => {
        console.log("Clicked point:", event.points[0]);
      }}
      onSelected={(event) => {
        setSelectedPoints(event.points);
        console.log("Selected points:", event.points.length);
      }}
      onRelayout={(event) => {
        console.log("Layout changed:", event);
      }}
    />
  );
}
```

### Responsive Layout

```tsx
import { createSignal } from "solid-js";
import { createPlotComponent, type PlotlyData, type PlotlyLayout } from "@dschz/solid-plotly";

const Plot = createPlotComponent(Plotly);

function ResponsivePlot() {
  const [data] = createSignal<PlotlyData[]>([{ x: [1, 2, 3], y: [1, 4, 2], type: "scatter" }]);
  const [layout] = createSignal<PlotlyLayout>({ title: "Responsive Chart" });

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Plot
        data={data()}
        layout={layout()}
        useResize={true} // Default: true
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
```

### Animation

```tsx
import { createSignal, createEffect, onCleanup } from "solid-js";
import { createPlotComponent, type PlotlyData, type PlotlyLayout } from "@dschz/solid-plotly";

const Plot = createPlotComponent(Plotly);

function AnimatedPlot() {
  const [frame, setFrame] = createSignal(0);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [layout] = createSignal<PlotlyLayout>({ title: "Animated Sine Wave" });

  createEffect(() => {
    if (!isAnimating()) return;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 60);
    }, 100);

    onCleanup(() => clearInterval(interval));
  });

  const data = (): PlotlyData[] => [
    {
      x: Array.from({ length: 50 }, (_, i) => i * 0.1),
      y: Array.from({ length: 50 }, (_, i) => Math.sin(i * 0.1 + frame() * 0.1)),
      type: "scatter",
      mode: "lines",
    },
  ];

  return (
    <div>
      <button onClick={() => setIsAnimating(!isAnimating())}>
        {isAnimating() ? "Stop" : "Start"} Animation
      </button>
      <Plot data={data()} layout={layout()} />
    </div>
  );
}
```

## Customizing Plotly.js Bundle

Choose the Plotly.js bundle that best fits your needs:

```tsx
// Full bundle (~3MB) - All chart types
import Plotly from "plotly.js-dist";
const Plot = createPlotComponent(Plotly);

// Basic bundle (~1MB) - Common chart types
import Plotly from "plotly.js-basic-dist";
const Plot = createPlotComponent(Plotly);

// Minimal bundle (~400KB) - Essential charts only
import Plotly from "plotly.js-dist-min";
const Plot = createPlotComponent(Plotly);
```

## TypeScript Usage

The library provides comprehensive TypeScript support with utility types to reduce friction when defining your chart data and configurations:

```tsx
import { createSignal } from "solid-js";
import {
  createPlotComponent,
  type PlotlyData,
  type PlotlyLayout,
  type PlotlyConfig,
  type PlotlyFigure,
  type PlotProps,
} from "@dschz/solid-plotly";

// Use utility types for your signals
const [data, setData] = createSignal<PlotlyData[]>([
  { x: [1, 2, 3], y: [1, 4, 2], type: "scatter" },
]);

const [layout, setLayout] = createSignal<PlotlyLayout>({
  title: "My Chart",
  xaxis: { title: "X Axis" },
  yaxis: { title: "Y Axis" },
});

const [config, setConfig] = createSignal<PlotlyConfig>({
  displayModeBar: true,
  responsive: true,
});

// Type-safe callbacks
const handleInitialized = (figure: PlotlyFigure, element: PlotlyHTMLElement) => {
  console.log("Initialized with", figure.data.length, "traces");
  setData(figure.data);
  setLayout(figure.layout);
};

// Create your Plot component
const Plot = createPlotComponent(Plotly);

function MyChart() {
  return (
    <Plot data={data()} layout={layout()} config={config()} onInitialized={handleInitialized} />
  );
}
```

### Available Utility Types

- **`PlotlyData`** - Single data trace type (use `PlotlyData[]` for the data prop)
- **`PlotlyLayout`** - Layout configuration object
- **`PlotlyConfig`** - Plotly configuration options
- **`PlotlyFrame`** - Animation frame type (use `PlotlyFrame[]` for frames prop)
- **`PlotlyFigure`** - Complete figure data structure (used in callbacks)
- **`PlotProps`** - Complete props interface for the Plot component
- **`PlotlyModule`** - Type for the Plotly.js module interface

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For more examples and detailed documentation, visit the [GitHub repository](https://github.com/dsnchz/solid-plotly) or check out the [Discord](https://discord.gg/XUVHnhsHKK) community.

## License

MIT License
