import { createSignal } from "solid-js";

import { type PlotlyData, type PlotlyLayout } from "../../src";
import { Plot } from "../components/Plot";

export default function ResponsiveExample() {
  const [containerWidth, setContainerWidth] = createSignal(100);
  const [containerHeight, setContainerHeight] = createSignal(400);

  const [data] = createSignal<PlotlyData[]>([
    {
      x: ["Q1", "Q2", "Q3", "Q4"],
      y: [20, 14, 23, 25],
      type: "bar",
      marker: { color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"] },
    },
    {
      x: ["Q1", "Q2", "Q3", "Q4"],
      y: [16, 18, 17, 19],
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "#FFA07A", size: 10 },
      line: { color: "#FFA07A", width: 3 },
      yaxis: "y2",
      name: "Trend",
    },
  ]);

  const [layout] = createSignal<PlotlyLayout>({
    title: { text: "Responsive Chart Example" },
    margin: { l: 50, r: 50, t: 50, b: 50 },
    xaxis: { title: { text: "Quarter" } },
    yaxis: { title: { text: "Sales (K)" } },
    yaxis2: {
      title: { text: "Trend Score" },
      overlaying: "y",
      side: "right",
    },
    showlegend: true,
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Responsive Example</h1>

      <div class="mb-6 space-y-4">
        <p class="text-gray-600">
          This example demonstrates responsive behavior. The chart automatically resizes when you
          change the container dimensions or resize the window.
        </p>

        <div class="flex flex-wrap gap-4 items-center">
          <label class="flex items-center gap-2">
            Container Width (%):
            <input
              type="range"
              min="50"
              max="100"
              value={containerWidth()}
              onInput={(e) => setContainerWidth(parseInt(e.currentTarget.value))}
              class="w-32"
            />
            <span class="w-12 text-center">{containerWidth()}%</span>
          </label>

          <label class="flex items-center gap-2">
            Container Height (px):
            <input
              type="range"
              min="300"
              max="600"
              value={containerHeight()}
              onInput={(e) => setContainerHeight(parseInt(e.currentTarget.value))}
              class="w-32"
            />
            <span class="w-12 text-center">{containerHeight()}</span>
          </label>
        </div>
      </div>

      <div
        class="border-2 border-dashed border-gray-300 p-4 transition-all duration-300"
        style={{
          width: `${containerWidth()}%`,
          height: `${containerHeight()}px`,
        }}
      >
        <Plot
          data={data()}
          layout={layout()}
          useResize
          style={{ width: "100%", height: "100%" }}
          config={{
            displayModeBar: true,
          }}
        />
      </div>

      <div class="mt-4 p-4 bg-blue-50 rounded">
        <h3 class="font-semibold mb-2">Responsive Features:</h3>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>
            <code>useResize={true}</code> - Automatically handles all resize behavior
          </li>
          <li>
            <code>style="width: 100%; height: 100%"</code> - Fills container
          </li>
          <li>
            When <code>useResize</code> is enabled, the component automatically sets:
            <ul class="list-disc list-inside ml-4 mt-1">
              <li>
                <code>layout.autosize: true</code>
              </li>
              <li>
                <code>config.responsive: true</code>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
