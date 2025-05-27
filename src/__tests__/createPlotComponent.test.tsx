import { cleanup, render, waitFor } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createPlotComponent } from "../createPlotComponent";
import type { PlotlyConfig, PlotlyData, PlotlyLayout } from "../types";

// Mock Plotly module
const mockPlotlyModule = {
  newPlot: vi.fn(),
  react: vi.fn(),
  purge: vi.fn(),
  Plots: {
    resize: vi.fn(),
  },
};

// Mock PlotlyHTMLElement interface
interface MockPlotlyHTMLElement {
  data: PlotlyData[];
  layout: PlotlyLayout;
  on: ReturnType<typeof vi.fn>;
  removeAllListeners: ReturnType<typeof vi.fn>;
  _transitionData?: {
    _frames: Array<{ name: string; data: PlotlyData[]; layout: object }>;
  };
}

// Mock PlotlyHTMLElement
const mockPlotElement: MockPlotlyHTMLElement = {
  data: [{ x: [1, 2, 3], y: [1, 4, 2], type: "scatter" }],
  layout: { title: { text: "Test Chart" } },
  on: vi.fn(),
  removeAllListeners: vi.fn(),
};

// Mock ResizeObserver interface
interface MockResizeObserver {
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
}

// Mock ResizeObserver
const mockResizeObserver: MockResizeObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
};

describe("createPlotComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPlotlyModule.newPlot.mockResolvedValue(mockPlotElement);
    mockPlotlyModule.react.mockResolvedValue(mockPlotElement);
    global.ResizeObserver = vi.fn(() => mockResizeObserver) as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    cleanup();
  });

  it("creates a plot component with factory pattern", () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    expect(typeof Plot).toBe("function");
  });

  it("renders plot with default props", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);

    render(() => <Plot data={[{ x: [1, 2, 3], y: [1, 4, 2], type: "scatter" }]} />);

    await waitFor(() => {
      const plotContainer = document.getElementById("solid-plotly");
      expect(plotContainer).toBeInTheDocument();
      expect(plotContainer!.id).toBe("solid-plotly");
    });

    await waitFor(() => {
      expect(mockPlotlyModule.newPlot).toHaveBeenCalledWith(
        expect.any(Element),
        [{ x: [1, 2, 3], y: [1, 4, 2], type: "scatter" }],
        { autosize: true },
        { responsive: true },
      );
    });
  });

  it("renders plot with custom props", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const layout: PlotlyLayout = { title: { text: "Custom Chart" } };
    const config: PlotlyConfig = { displayModeBar: false };

    render(() => (
      <Plot
        data={[{ x: [1, 2], y: [3, 4], type: "bar" }]}
        layout={layout}
        config={config}
        id="custom-plot"
        class="custom-class"
        useResize={false}
      />
    ));

    await waitFor(() => {
      const plotContainer = document.getElementById("custom-plot");
      expect(plotContainer).toBeInTheDocument();
      expect(plotContainer!.id).toBe("custom-plot");
      expect(plotContainer!.className).toBe("custom-class");
    });

    await waitFor(() => {
      expect(mockPlotlyModule.newPlot).toHaveBeenCalledWith(
        expect.any(Element),
        [{ x: [1, 2], y: [3, 4], type: "bar" }],
        { title: { text: "Custom Chart" } },
        { displayModeBar: false },
      );
    });
  });

  it("handles reactive data updates", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const [data, setData] = createSignal<PlotlyData[]>([{ x: [1, 2], y: [3, 4], type: "scatter" }]);

    render(() => <Plot data={data()} />);

    await waitFor(() => {
      expect(mockPlotlyModule.newPlot).toHaveBeenCalled();
    });

    // Update data
    setData([{ x: [1, 2, 3], y: [3, 4, 5], type: "scatter" }]);

    await waitFor(() => {
      expect(mockPlotlyModule.react).toHaveBeenCalledWith(
        expect.any(Element),
        [{ x: [1, 2, 3], y: [3, 4, 5], type: "scatter" }],
        { autosize: true },
        { responsive: true },
      );
    });
  });

  it("handles reactive layout updates", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const [layout, setLayout] = createSignal<PlotlyLayout>({ title: { text: "Initial" } });

    render(() => <Plot data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]} layout={layout()} />);

    await waitFor(() => {
      expect(mockPlotlyModule.newPlot).toHaveBeenCalled();
    });

    // Update layout
    setLayout({ title: { text: "Updated" } });

    await waitFor(() => {
      expect(mockPlotlyModule.react).toHaveBeenCalledWith(
        expect.any(Element),
        [{ x: [1, 2], y: [3, 4], type: "scatter" }],
        { title: { text: "Updated" }, autosize: true },
        { responsive: true },
      );
    });
  });

  describe("event handling integration", () => {
    it("attaches event listeners during initialization", async () => {
      const Plot = createPlotComponent(mockPlotlyModule);
      const onClick = vi.fn();
      const onHover = vi.fn();
      const onRelayout = vi.fn();
      const onInitialized = vi.fn();

      render(() => (
        <Plot
          data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]}
          onClick={onClick}
          onHover={onHover}
          onRelayout={onRelayout}
          onInitialized={onInitialized}
        />
      ));

      // Wait for the plot to be fully initialized
      await waitFor(() => {
        expect(onInitialized).toHaveBeenCalled();
      });

      // Now verify event listeners were attached
      expect(mockPlotElement.on).toHaveBeenCalledWith("plotly_click", onClick);
      expect(mockPlotElement.on).toHaveBeenCalledWith("plotly_hover", onHover);
      expect(mockPlotElement.on).toHaveBeenCalledWith("plotly_relayout", onRelayout);
    });

    it("skips undefined event handlers", async () => {
      const Plot = createPlotComponent(mockPlotlyModule);
      const onClick = vi.fn();
      const onInitialized = vi.fn();

      render(() => (
        <Plot
          data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]}
          onClick={onClick}
          onHover={undefined}
          onInitialized={onInitialized}
        />
      ));

      await waitFor(() => {
        expect(onInitialized).toHaveBeenCalled();
      });

      expect(mockPlotElement.on).toHaveBeenCalledWith("plotly_click", onClick);
      expect(mockPlotElement.on).not.toHaveBeenCalledWith("plotly_hover", undefined);
    });

    it("removes event listeners on unmount", async () => {
      const Plot = createPlotComponent(mockPlotlyModule);
      const onClick = vi.fn();
      const onHover = vi.fn();
      const onInitialized = vi.fn();

      const { unmount } = render(() => (
        <Plot
          data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]}
          onClick={onClick}
          onHover={onHover}
          onInitialized={onInitialized}
        />
      ));

      await waitFor(() => {
        expect(onInitialized).toHaveBeenCalled();
      });

      unmount();

      await waitFor(() => {
        expect(mockPlotElement.removeAllListeners).toHaveBeenCalledWith("plotly_click");
        expect(mockPlotElement.removeAllListeners).toHaveBeenCalledWith("plotly_hover");
      });
    });
  });

  describe("figure data extraction integration", () => {
    it("extracts figure data with frames in onInitialized callback", async () => {
      const Plot = createPlotComponent(mockPlotlyModule);
      const onInitialized = vi.fn();

      // Mock element with frames
      const mockElementWithFrames = {
        ...mockPlotElement,
        _transitionData: {
          _frames: [
            {
              name: "frame1",
              data: [{ x: [1], y: [2], type: "scatter" }],
              layout: {},
            },
          ],
        },
      };
      mockPlotlyModule.newPlot.mockResolvedValue(mockElementWithFrames);

      render(() => (
        <Plot data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]} onInitialized={onInitialized} />
      ));

      await waitFor(() => {
        expect(onInitialized).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.any(Array),
            layout: expect.any(Object),
            frames: expect.arrayContaining([expect.objectContaining({ name: "frame1" })]),
          }),
          mockElementWithFrames,
        );
      });
    });

    it("extracts figure data without frames when not present", async () => {
      const Plot = createPlotComponent(mockPlotlyModule);
      const onInitialized = vi.fn();

      render(() => (
        <Plot data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]} onInitialized={onInitialized} />
      ));

      await waitFor(() => {
        expect(mockPlotlyModule.newPlot).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(onInitialized).toHaveBeenCalledWith(
          expect.objectContaining({
            data: mockPlotElement.data,
            layout: mockPlotElement.layout,
            frames: expect.any(Array), // Will be empty array when no _transitionData
          }),
          mockPlotElement,
        );
      });
    });
  });

  it("sets up resize observer when useResize is true", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);

    render(() => <Plot data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]} useResize={true} />);

    await waitFor(() => {
      expect(mockPlotlyModule.newPlot).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockResizeObserver.observe).toHaveBeenCalled();
    });
  });

  it("does not set up resize observer when useResize is false", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);

    render(() => <Plot data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]} useResize={false} />);

    await waitFor(() => {
      expect(mockPlotlyModule.newPlot).toHaveBeenCalled();
    });

    expect(mockResizeObserver.observe).not.toHaveBeenCalled();
  });

  it("calls lifecycle callbacks", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const onInitialized = vi.fn();
    const onUpdate = vi.fn();

    const [data, setData] = createSignal<PlotlyData[]>([{ x: [1, 2], y: [3, 4], type: "scatter" }]);

    render(() => <Plot data={data()} onInitialized={onInitialized} onUpdate={onUpdate} />);

    await waitFor(() => {
      expect(mockPlotlyModule.newPlot).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onInitialized).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockPlotElement.data,
          layout: mockPlotElement.layout,
          frames: expect.any(Array),
        }),
        mockPlotElement,
      );
    });

    // Update data to trigger onUpdate
    setData([{ x: [1, 2, 3], y: [3, 4, 5], type: "scatter" }]);

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
  });

  it("handles errors during plot creation", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const onError = vi.fn();
    const error = new Error("Plot creation failed");

    mockPlotlyModule.newPlot.mockRejectedValueOnce(error);

    render(() => <Plot data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]} onError={onError} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  it("handles errors during plot updates", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const onError = vi.fn();
    const error = new Error("Plot update failed");

    const [data, setData] = createSignal<PlotlyData[]>([{ x: [1, 2], y: [3, 4], type: "scatter" }]);

    render(() => <Plot data={data()} onError={onError} />);

    await waitFor(() => {
      expect(mockPlotlyModule.newPlot).toHaveBeenCalled();
    });

    // Mock error on update
    mockPlotlyModule.react.mockRejectedValueOnce(error);
    setData([{ x: [1, 2, 3], y: [3, 4, 5], type: "scatter" }]);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  it("cleans up properly on unmount", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const onPurge = vi.fn();
    const onInitialized = vi.fn();
    const onClick = vi.fn();
    const onHover = vi.fn();

    const { unmount } = render(() => (
      <Plot
        data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]}
        onPurge={onPurge}
        onInitialized={onInitialized}
        onClick={onClick}
        onHover={onHover}
        useResize={true}
      />
    ));

    await waitFor(() => {
      expect(onInitialized).toHaveBeenCalled();
    });

    unmount();

    await waitFor(() => {
      expect(mockResizeObserver.disconnect).toHaveBeenCalled();
      expect(mockPlotElement.removeAllListeners).toHaveBeenCalledWith("plotly_click");
      expect(mockPlotElement.removeAllListeners).toHaveBeenCalledWith("plotly_hover");
      expect(mockPlotlyModule.purge).toHaveBeenCalledWith(mockPlotElement);
      expect(onPurge).toHaveBeenCalled();
    });
  });

  it("applies useResize layout and config modifications", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);

    render(() => (
      <Plot
        data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]}
        layout={{ title: { text: "Test" } }}
        config={{ displayModeBar: true }}
        useResize={true}
      />
    ));

    await waitFor(() => {
      expect(mockPlotlyModule.newPlot).toHaveBeenCalledWith(
        expect.any(Element),
        [{ x: [1, 2], y: [3, 4], type: "scatter" }],
        { title: { text: "Test" }, autosize: true },
        { displayModeBar: true, responsive: true },
      );
    });
  });

  it("handles ref callback", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const refCallback = vi.fn();

    render(() => <Plot data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]} ref={refCallback} />);

    await waitFor(() => {
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  it("applies custom styles", () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const customStyle = { width: "500px", height: "300px" };

    render(() => <Plot data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]} style={customStyle} />);

    const plotContainer = document.getElementById("solid-plotly");
    expect(plotContainer).toBeInTheDocument();
    expect(plotContainer!.style.width).toBe("500px");
    expect(plotContainer!.style.height).toBe("300px");
  });

  it("calls onResize callback when useResize is enabled", async () => {
    const Plot = createPlotComponent(mockPlotlyModule);
    const onResize = vi.fn();
    const onInitialized = vi.fn();

    // Mock ResizeObserver to capture the callback
    let resizeCallback: () => void;
    const mockResizeObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    };

    global.ResizeObserver = vi.fn((callback) => {
      resizeCallback = callback;
      return mockResizeObserverInstance;
    }) as unknown as typeof ResizeObserver;

    render(() => (
      <Plot
        data={[{ x: [1, 2], y: [3, 4], type: "scatter" }]}
        useResize={true}
        onResize={onResize}
        onInitialized={onInitialized}
      />
    ));

    await waitFor(() => {
      expect(onInitialized).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockResizeObserverInstance.observe).toHaveBeenCalled();
    });

    // Trigger the resize callback that was captured
    resizeCallback!();

    expect(onResize).toHaveBeenCalled();
  });
});
