import type {
  LegendClickEvent,
  PlotHoverEvent,
  PlotMouseEvent,
  PlotRelayoutEvent,
  PlotSelectionEvent,
} from "plotly.js";
import { createSignal, For } from "solid-js";

import { type PlotlyData, type PlotlyLayout } from "../../src";
import { Plot } from "../components/Plot";

export default function EventsExample() {
  const [eventLog, setEventLog] = createSignal<string[]>([]);
  const [maxLogEntries] = createSignal(20);
  const [showAdvancedEvents, setShowAdvancedEvents] = createSignal(false);

  const addToLog = (eventName: string, details?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const message = details ? `${eventName}: ${details}` : eventName;
    setEventLog((prev) => [`${timestamp} - ${message}`, ...prev.slice(0, maxLogEntries() - 1)]);
  };

  const [data, setData] = createSignal<PlotlyData[]>([
    {
      x: [1, 2, 3, 4, 5],
      y: [2, 4, 3, 5, 6],
      type: "scatter",
      mode: "lines+markers",
      name: "Interactive Trace",
      marker: { color: "blue", size: 12 },
      line: { width: 3 },
    },
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 3, 2, 4, 5],
      type: "bar",
      name: "Bar Chart",
      marker: { color: "rgba(255, 99, 132, 0.7)" },
    },
    {
      values: [30, 25, 20, 15, 10],
      labels: ["A", "B", "C", "D", "E"],
      type: "pie",
      name: "Pie Chart",
      domain: { x: [0.7, 1], y: [0.7, 1] },
      textinfo: "label+percent",
    },
  ]);

  const [layout, setLayout] = createSignal<PlotlyLayout>({
    title: { text: "Comprehensive Event Handling Demo" },
    width: 900,
    height: 600,
    dragmode: "select",
    selectdirection: "d",
    showlegend: true,
    annotations: [
      {
        x: 3,
        y: 4,
        text: "Click me!",
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: "red",
      },
    ],
    updatemenus: [
      {
        type: "buttons",
        direction: "left",
        buttons: [
          {
            args: [{ visible: [true, true, true] }],
            label: "Show All",
            method: "restyle",
          },
          {
            args: [{ visible: [true, false, false] }],
            label: "Scatter Only",
            method: "restyle",
          },
        ],
        pad: { r: 10, t: 10 },
        showactive: true,
        x: 0.01,
        xanchor: "left",
        y: 1.02,
        yanchor: "top",
      },
    ],
    sliders: [
      {
        active: 2,
        currentvalue: { prefix: "Value: " },
        pad: { t: 50 },
        steps: [
          { label: "1", method: "restyle", args: [{ "marker.size": 8 }] },
          { label: "2", method: "restyle", args: [{ "marker.size": 12 }] },
          { label: "3", method: "restyle", args: [{ "marker.size": 16 }] },
          { label: "4", method: "restyle", args: [{ "marker.size": 20 }] },
        ],
      },
    ],
  });

  // Event Handlers
  const handleClick = (event: PlotMouseEvent) => {
    const point = event.points?.[0];
    if (point && point.data?.name) {
      addToLog("Click", `${point.data.name} at (${point.x}, ${point.y})`);
    }
  };

  const handleDoubleClick = () => {
    addToLog("Double Click", "Chart reset/zoom out");
  };

  const handleHover = (event: PlotHoverEvent) => {
    const point = event.points?.[0];
    if (point && point.data?.name) {
      addToLog("Hover", `${point.data.name} at (${point.x}, ${point.y})`);
    }
  };

  const handleUnhover = () => {
    addToLog("Unhover", "Mouse left data point");
  };

  const handleSelected = (event: PlotSelectionEvent) => {
    if (event?.points?.length) {
      addToLog("Selected", `${event.points.length} points selected`);
    }
  };

  const handleSelecting = (event: PlotSelectionEvent) => {
    if (event?.points?.length) {
      addToLog("Selecting", `Selecting ${event.points.length} points...`);
    }
  };

  const handleDeselect = () => {
    addToLog("Deselect", "Selection cleared");
  };

  const handleRelayout = (event: PlotRelayoutEvent) => {
    const keys = Object.keys(event);
    if (keys.some((key) => key.includes("range"))) {
      addToLog("Relayout", "Zoom/pan changed");
    } else {
      addToLog("Relayout", `Layout changed: ${keys.join(", ")}`);
    }
  };

  const handleRelayouting = (_event: PlotRelayoutEvent) => {
    addToLog("Relayouting", "Layout changing...");
  };

  const handleRestyle = (_event: unknown) => {
    addToLog("Restyle", "Style properties changed");
  };

  const handleLegendClick = (event: LegendClickEvent) => {
    if (event?.data?.[event.curveNumber]?.name) {
      addToLog("Legend Click", `${event.data[event.curveNumber]?.name}`);
    }
    return true; // Allow default behavior
  };

  const handleLegendDoubleClick = (event: LegendClickEvent) => {
    if (event?.data?.[event.curveNumber]?.name) {
      addToLog("Legend Double Click", `${event.data[event.curveNumber]?.name}`);
    }
    return true;
  };

  const handleClickAnnotation = (_event: unknown) => {
    addToLog("Click Annotation", "Annotation clicked");
  };

  const handleSliderChange = (_event: unknown) => {
    addToLog("Slider Change", "Slider changed");
  };

  const handleSliderStart = (_event: unknown) => {
    addToLog("Slider Start", "Started dragging slider");
  };

  const handleSliderEnd = (_event: unknown) => {
    addToLog("Slider End", "Finished dragging slider");
  };

  const handleAfterPlot = () => {
    addToLog("After Plot", "Plot rendering completed");
  };

  const handleBeforePlot = (): boolean => {
    addToLog("Before Plot", "About to render plot");
    return true;
  };

  const handleRedraw = () => {
    addToLog("Redraw", "Plot redrawn");
  };

  const handleAutoSize = () => {
    addToLog("Auto Size", "Plot auto-resized");
  };

  const handleAnimated = () => {
    addToLog("Animated", "Animation completed");
  };

  const handleTransitioning = () => {
    addToLog("Transitioning", "Transition in progress");
  };

  // Trigger some events programmatically
  const triggerRestyle = () => {
    const newColors = ["red", "green", "blue"];
    setData([
      {
        x: [1, 2, 3, 4, 5],
        y: [2, 4, 3, 5, 6],
        type: "scatter",
        mode: "lines+markers",
        name: "Interactive Trace",
        marker: { color: newColors[0], size: 12 },
        line: { width: 3 },
      },
      {
        x: [1, 2, 3, 4, 5],
        y: [1, 3, 2, 4, 5],
        type: "bar",
        name: "Bar Chart",
        marker: { color: newColors[1] },
      },
      {
        values: [30, 25, 20, 15, 10],
        labels: ["A", "B", "C", "D", "E"],
        type: "pie",
        name: "Pie Chart",
        domain: { x: [0.7, 1], y: [0.7, 1] },
        textinfo: "label+percent",
        marker: { colors: [newColors[2], "#4ECDC4", "#45B7D1", "#96CEB4", "#FFA07A"] },
      },
    ]);
  };

  const triggerRelayout = () => {
    setLayout((prev) => ({
      ...prev,
      title: { text: `Updated at ${new Date().toLocaleTimeString()}` },
    }));
  };

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Comprehensive Events Example</h1>

      <div class="mb-6">
        <p class="text-gray-600 mb-4">
          This example demonstrates a wide range of Plotly event handlers. Try these interactions:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 class="font-semibold mb-2">Mouse Events:</h3>
            <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Click on data points</li>
              <li>Double-click to reset zoom</li>
              <li>Hover over data points</li>
              <li>Click on the red annotation</li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold mb-2">Selection Events:</h3>
            <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Drag to select multiple points</li>
              <li>Click legend items</li>
              <li>Use the buttons above the chart</li>
              <li>Drag the slider below the chart</li>
            </ul>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <button
            onClick={triggerRestyle}
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Trigger Restyle
          </button>
          <button
            onClick={triggerRelayout}
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Trigger Relayout
          </button>
          <button
            onClick={() => setShowAdvancedEvents(!showAdvancedEvents())}
            class="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
          >
            {showAdvancedEvents() ? "Hide" : "Show"} Advanced Events
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <Plot
            data={data()}
            layout={layout()}
            // Core interaction events
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onHover={handleHover}
            onUnhover={handleUnhover}
            // Selection events
            onSelected={handleSelected}
            onSelecting={handleSelecting}
            onDeselect={handleDeselect}
            // Layout events
            onRelayout={handleRelayout}
            onRelayouting={handleRelayouting}
            onRestyle={handleRestyle}
            // Legend events
            onLegendClick={handleLegendClick}
            onLegendDoubleClick={handleLegendDoubleClick}
            // UI element events
            onClickAnnotation={handleClickAnnotation}
            onSliderChange={handleSliderChange}
            onSliderStart={handleSliderStart}
            onSliderEnd={handleSliderEnd}
            // Plot lifecycle events
            {...(showAdvancedEvents() && {
              onAfterPlot: handleAfterPlot,
              onBeforePlot: handleBeforePlot,
              onRedraw: handleRedraw,
              onAutoSize: handleAutoSize,
              onAnimated: handleAnimated,
              onTransitioning: handleTransitioning,
            })}
            config={{
              displayModeBar: true,
              modeBarButtonsToAdd: ["select2d", "lasso2d"],
              scrollZoom: false,
              doubleClick: "reset+autosize",
              toImageButtonOptions: {
                format: "png",
                filename: "events-demo",
              },
            }}
          />
        </div>

        <div class="lg:col-span-1">
          <div class="bg-gray-100 p-4 rounded">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold">Event Log</h3>
              <button
                onClick={() => setEventLog([])}
                class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Clear
              </button>
            </div>

            <div class="space-y-1 text-xs font-mono max-h-96 overflow-y-auto">
              {eventLog().length === 0 ? (
                <div class="text-gray-500 italic">No events yet...</div>
              ) : (
                eventLog().map((entry, _index) => (
                  <div class="p-2 bg-white rounded border text-xs break-words">{entry}</div>
                ))
              )}
            </div>

            <div class="mt-2 text-xs text-gray-500">Showing last {maxLogEntries()} events</div>
          </div>
        </div>
      </div>

      <div class="mt-6 p-4 bg-blue-50 rounded">
        <h3 class="font-semibold mb-2">Available Event Handlers:</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
          <For
            each={[
              "onClick",
              "onDoubleClick",
              "onHover",
              "onUnhover",
              "onSelected",
              "onSelecting",
              "onDeselect",
              "onRelayout",
              "onRelayouting",
              "onRestyle",
              "onLegendClick",
              "onLegendDoubleClick",
              "onClickAnnotation",
              "onSliderChange",
              "onSliderStart",
              "onSliderEnd",
              "onAfterPlot",
              "onBeforePlot",
              "onRedraw",
              "onAutoSize",
              "onAnimated",
              "onTransitioning",
              "onSunburstClick",
              "onAnimatingFrame",
              "onAfterExport",
              "onBeforeExport",
              "onAnimationInterrupted",
              "onDeselect",
              "onFramework",
              "onTransitionInterrupted",
              "onEvent",
            ]}
          >
            {(event) => <code class="bg-white px-2 py-1 rounded text-xs border">{event}</code>}
          </For>
        </div>
      </div>
    </div>
  );
}
