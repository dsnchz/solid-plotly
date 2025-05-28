# @dschz/solid-plotly

## 0.1.0

### 🎉 Initial Release

Welcome to `@dschz/solid-plotly` - a modern, type-safe SolidJS wrapper for Plotly.js with fine-grained reactivity and comprehensive event support!

### ✨ Major Features

#### 🏭 **Factory Pattern Architecture**

- **Plotly-agnostic design** - Bring your own Plotly.js bundle for optimal bundle size
- **Flexible distribution support** - Works with `plotly.js-dist-min`, `plotly.js-basic-dist`, `plotly.js-dist`, or custom builds
- **Tree-shakable** - Only includes the Plotly.js features you actually use
- **Zero bundled dependencies** - No Plotly.js version lock-in

#### ⚡ **SolidJS Integration**

- **Fine-grained reactivity** - Leverages SolidJS's reactive primitives for optimal performance
- **Efficient updates** - Only re-renders when data actually changes
- **Automatic lifecycle management** - Handles component mounting, updating, and cleanup
- **Signal-friendly** - Works seamlessly with SolidJS signals and stores

#### 📱 **Responsive by Default**

- **Automatic resizing** - Built-in ResizeObserver integration for responsive charts
- **Container-aware** - Automatically adapts to parent container size changes
- **Performance optimized** - Efficient resize handling with proper cleanup
- **Configurable** - Can be disabled via `useResize={false}` prop

#### 🎯 **Complete TypeScript Support**

- **Full type safety** - Comprehensive TypeScript definitions for all Plotly.js types
- **Utility types** - Exported `PlotlyData`, `PlotlyLayout`, `PlotlyConfig`, and more
- **JSDoc documentation** - Detailed inline documentation for all props and methods
- **IntelliSense support** - Rich autocompletion and type checking in IDEs

### 🎪 **Event System**

#### **30+ Event Handlers**

Complete support for all official Plotly.js events:

**Mouse & Interaction Events:**

- `onClick`, `onDoubleClick`, `onHover`, `onUnhover`

**Selection Events:**

- `onSelected`, `onSelecting`, `onDeselect`

**Layout Events:**

- `onRelayout`, `onRelayouting`, `onRestyle`

**Legend Events:**

- `onLegendClick`, `onLegendDoubleClick`

**UI Element Events:**

- `onClickAnnotation`, `onSliderChange`, `onSliderStart`, `onSliderEnd`

**Plot Lifecycle Events:**

- `onAfterPlot`, `onBeforePlot`, `onRedraw`, `onAutoSize`

**Animation Events:**

- `onAnimated`, `onAnimatingFrame`, `onAnimationInterrupted`, `onTransitioning`, `onTransitionInterrupted`

**Export Events:**

- `onAfterExport`, `onBeforeExport`

**Framework Events:**

- `onFramework`, `onSunburstClick`, `onEvent`

#### **Lifecycle Callbacks**

- `onInitialized` - Fired when plot is first created
- `onUpdate` - Fired when plot data/layout updates
- `onPurge` - Fired when plot is destroyed
- `onResize` - Fired when plot is resized
- `onError` - Fired when errors occur during plot operations

### 🛠 **Component API**

#### **Core Props**

- `data: PlotlyData[]` - Array of data traces (required)
- `layout?: PlotlyLayout` - Layout configuration for axes, title, margins, etc.
- `config?: PlotlyConfig` - Plotly configuration options
- `frames?: PlotlyFrame[]` - Animation frames for animated plots

#### **Customization Props**

- `id?: string` - Container element ID (default: "solid-plotly")
- `class?: string` - CSS class names for styling
- `style?: JSX.CSSProperties` - Inline styles
- `ref?: (el: HTMLDivElement) => void` - Access to underlying DOM element

#### **Behavior Props**

- `useResize?: boolean` - Enable/disable automatic resizing (default: true)

### 🔧 **Developer Experience**

#### **Comprehensive Documentation**

- **Detailed README** - Complete API reference with examples
- **TypeScript examples** - Real-world usage patterns
- **Multiple chart types** - Examples for scatter, bar, line, pie, and more
- **Animation examples** - Frame-based and real-time data updates
- **Event handling examples** - Interactive chart implementations

#### **Example Patterns**

- **Reactive data updates** - Dynamic chart updates with SolidJS signals
- **Event handling** - Interactive charts with click, hover, and selection
- **Responsive layouts** - Auto-resizing charts that adapt to containers
- **Animation** - Smooth transitions and real-time data streaming
- **Error handling** - Robust error management and recovery

### ✅ **Quality Assurance**

#### **Comprehensive Testing**

- **28 test cases** across 2 test files
- **100% code coverage** - Statements, branches, functions, and lines
- **Integration tests** - End-to-end component behavior testing
- **Unit tests** - Individual utility function testing
- **Mock-based testing** - Isolated component testing without Plotly.js dependency

#### **Test Coverage Areas**

- Component lifecycle (mount, update, unmount)
- Event attachment and removal
- Reactive data updates
- Error handling and recovery
- Resize observer integration
- Figure data extraction
- Edge cases and error conditions

#### **Code Quality**

- **TypeScript strict mode** - Maximum type safety
- **ESLint configuration** - Consistent code style and best practices
- **Prettier formatting** - Automated code formatting
- **Build validation** - Successful compilation and bundling

### 🎛 **Supported Plotly.js Distributions**

#### **Recommended for Web Apps**

- `plotly.js-dist-min` (~4.3MB minified, ~1.3MB minified+gzipped) - Most chart types with full features

#### **Other Supported Distributions**

- `plotly.js-basic-dist` (~2.7MB unpacked, ~333KB minified+gzipped) - Basic chart types (bar, pie, scatter)
- `plotly.js-dist` (~10.8MB unpacked, ~1.3MB minified+gzipped) - All chart types and features
- `plotly.js` - Custom builds with cherry-picked modules

### 📦 **Package Information**

#### **Bundle Characteristics**

- **Zero runtime dependencies** - Only peer dependency on solid-js
- **Small bundle size** - Core library is lightweight and tree-shakable
- **ESM and CJS support** - Works in modern and legacy environments
- **TypeScript declarations** - Complete .d.ts files for type checking

#### **Peer Dependencies**

- `solid-js >= 1.6.0` - Compatible with all modern SolidJS versions

#### **Runtime Dependencies**

- `@dschz/try-catch ^1.1.2` - Utility for safe async operations

### 🚀 **Getting Started**

```bash
# Install the library
npm install @dschz/solid-plotly

# Choose your Plotly.js distribution
npm install plotly.js-dist-min  # Recommended for most web apps
```

```tsx
import Plotly from "plotly.js-dist-min";
import { createPlotComponent } from "@dschz/solid-plotly";

// Create your Plot component
const Plot = createPlotComponent(Plotly);

// Use in your app
function MyChart() {
  return (
    <Plot
      data={[{ x: [1, 2, 3], y: [1, 4, 2], type: "scatter" }]}
      layout={{ title: "My First Chart" }}
      onClick={(event) => console.log("Clicked:", event.points)}
    />
  );
}
```

### 📋 **Migration Notes**

This is the initial release, so no migration is needed. Future releases will include migration guides as needed.

### 🙏 **Acknowledgments**

Special thanks to:

- The [SolidJS](https://solidjs.com) team for the amazing reactive framework
- The [Plotly.js](https://plotly.com/javascript/) team for the powerful charting library
- The React Plotly.js community for inspiration on API design

---

**Full Changelog**: https://github.com/dsnchz/solid-plotly/commits/v0.1.0
