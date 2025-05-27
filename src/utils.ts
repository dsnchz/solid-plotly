import type { PlotlyHTMLElement } from "plotly.js";

import type {
  PlotComponentEventHandlers,
  PlotComponentEventName,
  PlotlyEventName,
  PlotlyFigure,
  PlotlyFrame,
} from "./types";

export const convertComponentEventNameToPlotlyEventName = (eventName: PlotComponentEventName) => {
  const eventNameWithoutOnPrefix = eventName.substring(2); // remove the "on" prefix, as it's always present
  return `plotly_${eventNameWithoutOnPrefix.toLowerCase()}` as PlotlyEventName;
};

export const attachComponentEvents = (
  plotElement: PlotlyHTMLElement,
  componentEventMap: Partial<PlotComponentEventHandlers>,
) => {
  for (const eventName in componentEventMap) {
    const eventHandler = componentEventMap[eventName as PlotComponentEventName];

    if (!eventHandler) continue;

    const plotlyEventName = convertComponentEventNameToPlotlyEventName(
      eventName as PlotComponentEventName,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    plotElement.on(plotlyEventName, eventHandler);
  }
};

export const removeComponentEvents = (
  plotElement: PlotlyHTMLElement,
  componentEventMap: Partial<PlotComponentEventHandlers>,
) => {
  for (const eventName in componentEventMap) {
    const componentEventName = eventName as PlotComponentEventName;
    const eventHandler = componentEventMap[componentEventName];

    if (!eventHandler) continue;

    const plotlyEventName = convertComponentEventNameToPlotlyEventName(componentEventName);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    plotElement.removeAllListeners(plotlyEventName);
  }
};

type PlotlyHTMLElementWithTransitionData = PlotlyHTMLElement & {
  readonly _transitionData: {
    _frames: PlotlyFrame[];
  };
};

export const getFigureData = (plotElement: PlotlyHTMLElement): PlotlyFigure => {
  const pElem = plotElement as PlotlyHTMLElementWithTransitionData;

  const figureData = {
    data: pElem.data,
    layout: pElem.layout,
    frames: pElem._transitionData?._frames || [],
  };

  return figureData;
};
