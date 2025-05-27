import type { PlotlyHTMLElement } from "plotly.js-dist-min";
import { createSignal } from "solid-js";

import { type PlotlyData, type PlotlyFigure, type PlotlyLayout } from "../../src";
import { Plot } from "../components/Plot";

export default function FactoryExample() {
  const [data] = createSignal<PlotlyData[]>([
    {
      x: ["Jan", "Feb", "Mar", "Apr", "May"],
      y: [20, 14, 23, 25, 22],
      type: "bar",
      marker: { color: "rgba(55, 128, 191, 0.7)" },
    },
  ]);

  const [layout] = createSignal<PlotlyLayout>({
    width: 600,
    height: 400,
    title: { text: "Factory Pattern Example" },
    xaxis: { title: { text: "Month" } },
    yaxis: { title: { text: "Sales" } },
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Factory Pattern Example</h1>
      <p class="mb-4 text-gray-600">
        This example shows how to use the factory pattern to create a Plot component with a custom
        Plotly bundle. Each example page creates its own Plot component locally.
      </p>

      <div class="mb-6 p-4 bg-gray-100 rounded">
        <h3 class="font-semibold mb-2">Code Example:</h3>
        <pre class="text-sm bg-white p-3 rounded border overflow-x-auto">
          {`import Plotly from "plotly.js-dist-min";
import { createPlotlyComponent } from "@dschz/solid-plotly";

// Create your Plot component locally
const Plot = createPlotlyComponent(Plotly);

// Use it in your component
export default function MyComponent() {
  return <Plot data={data} layout={layout} />;
}`}
        </pre>
      </div>

      <div class="mb-4 p-4 bg-blue-50 rounded">
        <h3 class="font-semibold mb-2">Benefits of the Factory Pattern:</h3>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>Choose your own Plotly bundle (full, basic, minimal, etc.)</li>
          <li>Tree-shake unused Plotly modules for smaller bundle size</li>
          <li>Use different Plotly versions in different parts of your app</li>
          <li>No dependency on a specific Plotly version in the library</li>
        </ul>
      </div>

      <Plot
        data={data()}
        layout={layout()}
        config={{ displayModeBar: true }}
        onInitialized={(figure: PlotlyFigure, graphDiv: PlotlyHTMLElement) => {
          console.log("Plot initialized:", figure, graphDiv);
        }}
        onUpdate={(figure: PlotlyFigure, graphDiv: PlotlyHTMLElement) => {
          console.log("Plot updated:", figure, graphDiv);
        }}
      />
    </div>
  );
}
