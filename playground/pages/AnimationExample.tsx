import { createEffect, createSignal, onCleanup } from "solid-js";

import { type PlotlyLayout } from "../../src";
import { Plot } from "../components/Plot";

export default function AnimationExample() {
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [currentFrame, setCurrentFrame] = createSignal(0);
  const [animationSpeed, setAnimationSpeed] = createSignal(500);

  // Generate data for different frames
  const generateFrameData = (frameIndex: number) => {
    const t = frameIndex * 0.1;
    const x = Array.from({ length: 50 }, (_, i) => i * 0.1);
    const y = x.map((val) => Math.sin(val + t) * Math.exp(-val * 0.1));
    return { x, y };
  };

  const [layout] = createSignal<PlotlyLayout>({
    width: 800,
    height: 500,
    title: { text: "Animation Example - Sine Wave" },
    xaxis: {
      title: { text: "X" },
      range: [0, 5],
    },
    yaxis: {
      title: { text: "Y" },
      range: [-1, 1],
    },
    transition: {
      duration: 300,
      easing: "cubic-in-out",
    },
  });

  // Animation frames
  const frames = Array.from({ length: 60 }, (_, i) => ({
    name: i.toString(),
    data: [
      {
        ...generateFrameData(i),
        type: "scatter" as const,
        mode: "lines" as const,
        line: { color: "blue", width: 3 },
        name: "Animated Wave",
      },
    ],
    group: "main",
    traces: [0],
    baseframe: undefined,
    layout: {},
  }));

  // Animation effect
  createEffect(() => {
    if (!isAnimating()) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, animationSpeed());

    onCleanup(() => clearInterval(interval));
  });

  const startAnimation = () => {
    setIsAnimating(true);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentFrame(0);
  };

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Animation Example</h1>

      <div class="mb-6 space-y-4">
        <p class="text-gray-600">
          This example demonstrates animated charts using frame-based animations. The sine wave
          moves continuously when animation is enabled.
        </p>

        <div class="flex flex-wrap gap-4 items-center">
          <button
            onClick={startAnimation}
            disabled={isAnimating()}
            class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded"
          >
            Start Animation
          </button>

          <button
            onClick={stopAnimation}
            disabled={!isAnimating()}
            class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded"
          >
            Stop Animation
          </button>

          <button
            onClick={resetAnimation}
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Reset
          </button>

          <label class="flex items-center gap-2">
            Speed (ms):
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={animationSpeed()}
              onInput={(e) => setAnimationSpeed(parseInt(e.currentTarget.value))}
              class="w-32"
            />
            <span class="w-12 text-center">{animationSpeed()}</span>
          </label>

          <div class="text-sm text-gray-600">
            Frame: {currentFrame() + 1} / {frames.length}
          </div>
        </div>
      </div>

      <Plot
        data={[
          {
            ...generateFrameData(currentFrame()),
            type: "scatter",
            mode: "lines",
            line: { color: "blue", width: 3 },
            name: "Animated Wave",
          },
        ]}
        layout={layout()}
        config={{
          displayModeBar: true,
          showTips: false,
        }}
      />

      <div class="mt-4 p-4 bg-yellow-50 rounded">
        <h3 class="font-semibold mb-2">Animation Features:</h3>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>Frame-based animation using Plotly frames</li>
          <li>Smooth transitions between data states</li>
          <li>Configurable animation speed</li>
          <li>Start/stop/reset controls</li>
          <li>Real-time frame counter</li>
        </ul>
      </div>
    </div>
  );
}
