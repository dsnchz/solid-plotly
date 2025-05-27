import type { PlotHoverEvent, PlotMouseEvent } from "plotly.js";
import { createSignal } from "solid-js";

import { type PlotlyData, type PlotlyLayout } from "../../src";
import { Plot } from "../components/Plot";

export default function BasicExample() {
  const [data] = createSignal<PlotlyData[]>([
    {
      x: [1, 2, 3, 4],
      y: [10, 11, 12, 13],
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "red" },
    },
    {
      x: [2, 3, 4, 5],
      y: [16, 15, 14, 13],
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "blue" },
    },
    {
      x: [1, 2, 3, 4],
      y: [12, 9, 15, 12],
      type: "bar",
    },
  ]);

  const [layout] = createSignal<PlotlyLayout>({
    width: 600,
    height: 400,
    title: { text: "Basic Example" },
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Basic Example</h1>
      <Plot
        data={data()}
        layout={layout()}
        onClick={(data: PlotMouseEvent) => console.log("Clicked:", data)}
        onHover={(data: PlotHoverEvent) => console.log("Hovered:", data)}
      />
    </div>
  );
}
