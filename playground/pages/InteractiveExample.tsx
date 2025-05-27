import type { PlotHoverEvent, PlotMouseEvent } from "plotly.js";
import { createEffect, createSignal, onCleanup } from "solid-js";

import { type PlotlyData, type PlotlyLayout } from "../../src";
import { Plot } from "../components/Plot";

export default function InteractiveExample() {
  const [dataPoints, setDataPoints] = createSignal(10);
  const [animationSpeed, setAnimationSpeed] = createSignal(1000);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [clickedPoint, setClickedPoint] = createSignal<string>("");
  const [hoveredPoint, setHoveredPoint] = createSignal<string>("");

  // Generate random data
  const generateData = () => {
    const x = Array.from({ length: dataPoints() }, (_, i) => i);
    const y = Array.from({ length: dataPoints() }, () => Math.random() * 100);
    return { x, y };
  };

  const [data, setData] = createSignal<PlotlyData[]>([
    {
      ...generateData(),
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "blue", size: 8 },
      line: { color: "blue" },
      name: "Random Data",
    },
  ]);

  const [layout] = createSignal<PlotlyLayout>({
    width: 800,
    height: 500,
    title: { text: "Interactive Real-time Data" },
    xaxis: { title: { text: "Time" } },
    yaxis: { title: { text: "Value" } },
  });

  // Animation effect
  createEffect(() => {
    if (!isAnimating()) return;

    const interval = setInterval(() => {
      setData([
        {
          ...generateData(),
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "blue", size: 8 },
          line: { color: "blue" },
          name: "Random Data",
        },
      ]);
    }, animationSpeed());

    onCleanup(() => clearInterval(interval));
  });

  const handleClick = (event: PlotMouseEvent) => {
    const point = event.points?.[0];
    if (point && typeof point.y === "number") {
      setClickedPoint(`Clicked: (${point.x}, ${point.y.toFixed(2)})`);
    }
  };

  const handleHover = (event: PlotHoverEvent) => {
    const point = event.points?.[0];
    if (point && typeof point.y === "number") {
      setHoveredPoint(`Hovering: (${point.x}, ${point.y.toFixed(2)})`);
    }
  };

  const handleUnhover = () => {
    setHoveredPoint("");
  };

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Interactive Example</h1>

      <div class="mb-6 space-y-4">
        <div class="flex flex-wrap gap-4 items-center">
          <label class="flex items-center gap-2">
            Data Points:
            <input
              type="range"
              min="5"
              max="50"
              value={dataPoints()}
              onInput={(e) => setDataPoints(parseInt(e.currentTarget.value))}
              class="w-32"
            />
            <span class="w-8 text-center">{dataPoints()}</span>
          </label>

          <label class="flex items-center gap-2">
            Animation Speed (ms):
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={animationSpeed()}
              onInput={(e) => setAnimationSpeed(parseInt(e.currentTarget.value))}
              class="w-32"
            />
            <span class="w-12 text-center">{animationSpeed()}</span>
          </label>

          <button
            onClick={() => setIsAnimating(!isAnimating())}
            class={`px-4 py-2 rounded text-white ${
              isAnimating() ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isAnimating() ? "Stop" : "Start"} Animation
          </button>

          <button
            onClick={() =>
              setData([
                {
                  ...generateData(),
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "blue", size: 8 },
                  line: { color: "blue" },
                  name: "Random Data",
                },
              ])
            }
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Generate New Data
          </button>
        </div>

        <div class="flex gap-4 text-sm">
          <div class="p-2 bg-blue-100 rounded">
            {clickedPoint() || "Click on a point to see coordinates"}
          </div>
          <div class="p-2 bg-green-100 rounded">
            {hoveredPoint() || "Hover over a point to see coordinates"}
          </div>
        </div>
      </div>

      <Plot
        data={data()}
        layout={layout()}
        onClick={handleClick}
        onHover={handleHover}
        onUnhover={handleUnhover}
        config={{ displayModeBar: true }}
      />
    </div>
  );
}
