import { A, Route, Router } from "@solidjs/router";
import { For, type ParentProps } from "solid-js";

import AnimationExample from "./pages/AnimationExample";
import BasicExample from "./pages/BasicExample";
import EventsExample from "./pages/EventsExample";
import FactoryExample from "./pages/FactoryExample";
import InteractiveExample from "./pages/InteractiveExample";
import ResponsiveExample from "./pages/ResponsiveExample";

const examples = [
  { path: "/basic", name: "Basic Example", component: BasicExample },
  { path: "/factory", name: "Factory Pattern", component: FactoryExample },
  { path: "/interactive", name: "Interactive", component: InteractiveExample },
  { path: "/responsive", name: "Responsive", component: ResponsiveExample },
  { path: "/events", name: "Events", component: EventsExample },
  { path: "/animation", name: "Animation", component: AnimationExample },
];

function Navigation() {
  return (
    <nav class="bg-gray-800 text-white p-4">
      <div class="container mx-auto">
        <h1 class="text-2xl font-bold mb-4">Solid Plotly Playground</h1>
        <div class="flex flex-wrap gap-4">
          <For each={examples}>
            {(example) => (
              <A
                href={example.path}
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                activeClass="bg-blue-800"
              >
                {example.name}
              </A>
            )}
          </For>
        </div>
      </div>
    </nav>
  );
}

function RootLayout(props: ParentProps) {
  return (
    <div class="min-h-screen">
      <Navigation />
      <main class="min-h-screen bg-gray-50">{props.children}</main>
    </div>
  );
}

function Home() {
  return (
    <div class="p-8">
      <h1 class="text-4xl font-bold mb-6">Welcome to Solid Plotly Playground</h1>
      <p class="text-lg text-gray-600 mb-8">
        This playground demonstrates various features and usage patterns of the Solid Plotly
        component. Navigate through the examples using the menu above.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={examples}>
          {(example) => (
            <div class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 class="text-xl font-semibold mb-2">{example.name}</h3>
              <p class="text-gray-600 mb-4">
                {example.path === "/basic" &&
                  "Simple scatter and bar charts with basic configuration"}
                {example.path === "/factory" &&
                  "Using the factory pattern with custom Plotly bundles"}
                {example.path === "/interactive" && "Real-time data updates and user interactions"}
                {example.path === "/responsive" && "Responsive charts that adapt to container size"}
                {example.path === "/events" && "Comprehensive event handling examples"}
                {example.path === "/animation" && "Animated transitions and frame-based animations"}
              </p>
              <A
                href={example.path}
                class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                View Example
              </A>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export const App = () => {
  return (
    <Router root={RootLayout}>
      <Route path="/" component={Home} />
      <For each={examples}>
        {(example) => <Route path={example.path} component={example.component} />}
      </For>
    </Router>
  );
};
