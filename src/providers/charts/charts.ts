import { Injectable } from "@angular/core";
//import { brush } from "d3-brush";
//import * as d3 from "d3";
import * as cloneDeep from "lodash.clonedeep";
import { sanitizeLeadingIndicator } from "../../constants";
import { Supstance } from "../supstance/supstance";
import * as throttle from 'lodash.throttle';

declare const d3: any;
type chartType =
  | "candlestick"
  | "ohlc"
  | "portfolio"
  | "atr"
  | "adx"
  | "aroon"
  | "atrtrailingstop"
  | "heikinashi"
  | "ichimoku"
  | "macd"
  | "rsi"
  | "stochastic"
  | "williams"
  | "bollinger"
  | "sroc"
  | "vwap";
type IndicatorType =
  | "adx"
  | "aroon"
  | "atr"
  | "atrtrailingstop"
  | "bollinger"
  | "ema"
  | "heikinashi"
  | "ichimoku"
  | "momentum"
  | "moneyflow"
  | "sma"
  | "sroc"
  | "vwap"
  | "candlestick"
  | "macd"
  | "ohlc"
  | "rsi"
  | "stochastic"
  | "williams";
declare const techan: any;

const chartTypes = [
  "candlestick",
  "ohlc",
  "portfolio",
  "atr",
  "adx",
  "aroon",
  "atrtrailingstop",
  "heikinashi",
  "ichimoku",
  "macd",
  "rsi",
  "stochastic",
  "williams",
  "bollinger",
  "sroc",
  "vwap",
];

export interface ChartsConfig {
  dims: Dims;
  hideYears?: boolean;
  data?: any;
  candlestick?: CandlestickConfig;
  portfolio?: PortfolioConfig;
  atr?: PeriodicIndicatorConfig;
  adx?: PeriodicIndicatorConfig;
  aroon?: AroonConfig;
  atrtrailingstop?: AtrTrailingStopConfig;
  heikinashi?: IndicatorConfig;
  ichimoku?: IchimokuConfig;
  macd?: MacdConfig;
  rsi?: RsiConfig;
  stochastic?: StochasticConfig;
  williams?: WilliamsConfig;
  sroc?: PeriodicIndicatorConfig;
  vwap?: PeriodicIndicatorConfig;
  bollinger?: BollingerConfig;

  ohlc?: OhlcConfig;
  sequence: (chartType | string)[];
  brush?: string; //the chart on which brushing will happen, typically the portfolio chart.
  overrideBrushNumDays?: number;
  minimumBrushSize?: number; //if the brush selection size is below this then the brush would be cleared. 
  baseYear?: number; //the base year used when hiding the year numbers

  svg?: d3.Selection<SVGGElement, any, HTMLElement, any>;
}

interface Margin {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface Dims {
  height: number;
  width?: number;
  margin?: Margin;
}

interface ChartConfig {
  dims: Dims;
  hide?: boolean;
  crossHair?: boolean;
  hideYears?: boolean;

  data?: Data;
  yLabel?: string;
  hideXAxis?: boolean;
  brushed?: boolean;
  leftAxisTicks?: number;
  bottomAxisTicks?: number;

  baseYear?: number; //optional, will use the global baseYear if not specified.

  //internal stuff:
  parentSvg?: d3.Selection<SVGGElement, any, HTMLElement, any>;
  parentDims?: Dims;
  internalClassName?: string;
  brushTargets?: { scale: any; update: Function; chart: Chart }[];
  _brush?: boolean;
}

type Data = DataOhlc | DataValues | { [key: string]: DataOhlc | DataValues };

export type DataOhlc = {
  date: Date;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  adj?: number;
}[];

type DataValues = {
  date: Date;
  value: number;
}[];

interface CandlestickConfig extends ChartConfig {
  data?: DataOhlc;

  showTrades?: boolean;
  trades?: Trades;
  showRightAxis?: boolean;
  showTopAxis?: boolean;
  rightAxisLabel?: string;
  showPriceInLeftAxis?: boolean;

  volumeAxisTicks?: number;
  topAxisTicks?: number;
  rightAxisTicks?: number;

  //sub-indicator-charts

  sma?: number[];
  ema?: number[];
  bollinger?: number[];
  atrTrailingStop?: number[];
  ichimoku?: boolean;

  //bollinger config:
  bollingerSdMultiplication?: number;

  //atr trailing stop config:
  atrTrailingStopMultiplier?: number;

  //ichimoku configs:
  tenkanSen?: number;
  kijunSen?: number;
  senkouSpanB?: number;

  showVolume?: boolean;

  //leading indicators
  DXY?: boolean;
  Unemployment?: boolean;
  Housing?: boolean;
  Yield?: boolean;
  SnP?: boolean;
  Industry?: boolean;
  VIX?: boolean;
  Recessions?: boolean;


  supstance?: {
    show?: boolean;
    visibility?: boolean[];
    color?: string[];
    algorithmConfig?: any;
    labels?: string[];
    annotationVisibility?: boolean[];
  }
}

interface OhlcConfig extends CandlestickConfig { }

interface PortfolioConfig extends ChartConfig {
  data: { portfolio: DataValues; close: DataOhlc; adjClose: DataValues };

  showPortfolio?: boolean;
  showClose?: boolean;
  showAdjClose?: boolean;
  showZeroLine?: boolean;
  showRightAxis?: boolean;

  portfolioTooltip?: string;
  closeTooltip?: string;
  adjCloseTooltip?: string;

  rightAxisTicks?: number;
}

interface IndicatorConfig extends ChartConfig {
  rightAxisTicks?: number;
  rightAxisLabel?: string;
  hideRightAxis?: boolean;
}

interface PeriodicIndicatorConfig extends IndicatorConfig {
  period?: number;
}

interface RsiConfig extends PeriodicIndicatorConfig {
  overbought?: number;
  oversold?: number;
  middle?: number;
}

interface AroonConfig extends PeriodicIndicatorConfig {
  overbought?: number;
  oversold?: number;
  middle?: number;
}
interface WilliamsConfig extends PeriodicIndicatorConfig {
  overbought?: number;
  oversold?: number;
  middle?: number;
}

interface AtrTrailingStopConfig extends PeriodicIndicatorConfig {
  multiplier?: number;
}

interface BollingerConfig extends PeriodicIndicatorConfig {
  sdMultiplication?: number;
}

interface IchimokuConfig extends IndicatorConfig {
  tenkanSen?: number;
  kijunSen?: number;
  senkouSpanB?: number;
}

interface MacdConfig extends IndicatorConfig {
  fast?: number;
  slow?: number;
  signal?: number;
}

interface StochasticConfig extends IndicatorConfig {
  periodD?: number;
  overbought?: number;
  oversold?: number;
}

type Tradetype = "buy" | "sell" | "buy-pending" | "sell-pending";
type Trade = {
  date: Date;
  short:boolean;
  type: Tradetype | string;
  price: number;
  quantity: number;
};
type Trades = Trade[];

type CandlestickData = {
  sma?: { [period: number]: any };
  ema?: { [period: number]: any };
  bollinger?: { [period: number]: any };
  atrTrailingStop?: { [period: number]: any };
  ichimoku?: any;
  ohlc: DataOhlc;
  supstance?: any;
};

type SupData = { value: number, start?: Date, end?: Date }[]

@Injectable()
export class ChartsProvider {


  charts: { [key: string]: Chart };
  config: ChartsConfig

  getData(chartType: string, date: Date) {
    if (chartType in this.charts) {
      return this.charts[chartType].getData(date);
    }
  }



  private getIndicatorKey(indicatorName: string, indicatorConfig: { [key: string]: number }): string {
    let out = indicatorName;
    let keys = Object.keys(indicatorConfig);
    keys.sort()
      .forEach(key => {
        out += `-${key}-${indicatorConfig[key]}`
      })
    return out;
  }

  private calculatedDataCache: { [ticker: string]: { [indicator: string]: any } } = {};


  /*

    function to get arbitrary indicator data (even if the indicator is not visible). You can use it like this:

    cp.calculateData("atr", new Date(2007,01,12))
    (the 01 means Feb not Jan by the way)

    or for charts with custom periods like:
    cp.calculateData("ema", new Date(2007,01,12), {period:14})

    or with more custom settings like:
    cp.calculateData("bollinger",new Date(2007,01,12), {period: 20, sdMultiplication: 2.25})

    By default it takes in data from portfolio's data.close . But if you want some other data that you want to pass yourself rather than picking up the current visible close (ohlc) data from portfolio, you can pass in any data that you have such as the 4th argument: 
    cp.calculateData("bollinger",new Date(2007,01,12), {period: 20, sdMultiplication: 2.25}, data)

    or if you don't have the options object,
    cp.calculateData("atr", new Date(2007,01,12), null, data)

    update: you can now pass in a dateKeyIndex instead of a date
    update: you can now pass in a ticker name. Full data for the ticker must be passed in the data argument when using this feature. This will cache indicator output resulting in faster subsequent calls for the same ticker-indicator combination.
    
  */
  calculateData(
    indicatorName: IndicatorType,
    d: Date | number,
    indicatorConfig: { [key: string]: number },
    data?: DataOhlc,
    ticker?: string
  ) {
    let outData: any[];
    let inputData: DataOhlc = data;
    if (ticker && this.calculatedDataCache[ticker] && this.calculatedDataCache[ticker][this.getIndicatorKey(indicatorName, indicatorConfig)]) {
      outData = this.calculatedDataCache[ticker][this.getIndicatorKey(indicatorName, indicatorConfig)];
    } else {
      if (!inputData) {
        inputData = this.charts["portfolio"].data["close"];
      }
      const indicator = techan.indicator[indicatorName]();

      if (
        typeof indicatorConfig === "object" &&
        !Array.isArray(indicatorConfig) &&
        !(indicatorConfig === null)
      ) {
        for (const key in indicatorConfig) {
          const value = indicatorConfig[key];
          indicator[key](value);
        }
      }
      outData = indicator(inputData);
      const dummyDataPoint = {
        "rawDate": "",
        "date": new Date(1500, 1, 1),
        "open": 0,
        "high": 0,
        "low": 0,
        "close": 0,
        "adj": null,
        "volume": 0
      }
      const delta = inputData.length - outData.length;
      for (let i = 0; i < delta; i++) {
        outData.unshift(dummyDataPoint);
      }
      if (ticker && data) {
        if (!this.calculatedDataCache[ticker]) {
          this.calculatedDataCache[ticker] = {};
        }
        this.calculatedDataCache[ticker][this.getIndicatorKey(indicatorName, indicatorConfig)] = outData;
      }
    }

    let answer;
    switch (typeof (d)) {
      case "number": {
        answer = outData[(d as number)];
        break;
      }
      case "object": {
        for (let i = 0; i < outData.length; i++) {
          let x = outData[i];
          let d2 = x.date;
          (d as Date).setHours(0, 0, 0, 0);
          d2.setHours(0, 0, 0, 0);
          if ((d as Date).getTime() == d2.getTime()) {
            answer = (x);
            break;
          }
        }
        break;
      }
    }


    // let answer = cloneDeep(
    //   outData.find((x) => {
    //     let d2 = x.date;
    //     d.setHours(0, 0, 0, 0);
    //     d2.setHours(0, 0, 0, 0);
    //     return d.getTime() == d2.getTime();
    //   })
    // );

    // if (answer && typeof answer === "object") {
    //   delete answer.date;
    // }


    return answer;
  }

  constructor() {
    this.charts = {};
    window["cp"] = this;
  }


  public onBrush(callback: Function) {
    this.brushCallbacks.push(callback);
  }

  public offBrush(callback: Function) {
    this.brushCallbacks = this.brushCallbacks.filter(cb => cb != callback);
  }

  public brushCallbacks = [];


  private brushScaleMap(startDate: Date, endDate: Date): { startW: number, endW: number } {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return;
    }
    let brushChart = this.charts[this.config.brush]
    if (!brushChart) {
      return;
    }
    const startW = startDate ? brushChart.xScale(startDate) : 0;
    const endW = endDate ? brushChart.xScale(endDate) : brushChart.config.dims.width;

    return { startW, endW };
  }

  private brushScaleMapReverse(startW: number = 0, endW: number): { startDate: Date, endDate: Date } {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return;
    }

    let brushChart = this.charts[this.config.brush];
    if (!brushChart) {
      return;
    }
    if (!endW) {
      endW = brushChart.config.dims.width
    }

    const startDate = brushChart.xScale.invert(startW);
    const endDate = brushChart.xScale.invert(endW);

    return { startDate, endDate };
  }


  setBrush(startDate?: Date, endDate?: Date) {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return;
    } 
    const brushChart = this.charts[this.config.brush];
    if (!brushChart) {
      return;
    }
    let domain: Date[] = brushChart.xScale.domain();
    if (startDate) {
      startDate.setHours(startDate.getHours() - 12);
    }
    if (endDate) {
      endDate.setHours(endDate.getHours() + 12);
    }


    if (startDate) {
      if (startDate.getTime() < domain[0].getTime()) {
        startDate = new Date(domain[0]);
      }
      if (startDate.getTime() > domain[domain.length - 1].getTime()) {
        startDate = new Date(domain[domain.length - 1]);
      }
    }
    if (endDate) {
      if (endDate.getTime() < domain[0].getTime()) {
        endDate = new Date(domain[0]);
      }
      if (endDate.getTime() > domain[domain.length - 1].getTime()) {
        endDate = new Date(domain[domain.length - 1]);
      }
    }
    let { startW, endW } = this.brushScaleMap(startDate, endDate);
    const chartSvg = brushChart.chartSvg;
    if (!chartSvg.select("g.pane")) { return }
    brushChart.brush.move(chartSvg.select("g.pane"), [startW, endW]);
  }

  setBrushDims(startW: number = 0, endW: number) {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return;
    }
    const brushChart = this.charts[this.config.brush];
    if (!brushChart) {
      return;
    }

    if (typeof endW === "undefined") {
      endW = brushChart.config.dims.width;
    }

    const chartSvg = brushChart.chartSvg;
    const brushSelection = chartSvg.select("g.pane");
    startW = Math.max(0, startW);
    startW = Math.min(brushChart.config.dims.width, startW);
    endW = Math.max(0, endW);
    endW = Math.min(brushChart.config.dims.width, endW);
    if (brushSelection) {
      brushChart.brush.move(chartSvg.select("g.pane"), [startW, endW]);
    }
  }

  clearBrush() {
    if (!this.config || !this.config.brush || !this.charts[this.config.brush]) {
      return;
    }
    if (!this.brushed) {
      return;
    }

    const brushChart = this.charts[this.config.brush];
    const chartSvg = brushChart.chartSvg;
    if (!chartSvg.select("g.pane")) { return }
    brushChart.brush.move(chartSvg.select("g.pane"), null);
  }

  getCurrentBrush(): { startDate: Date, endDate: Date } | null {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return null;
    }
    if (!this.brushed) {
      return null;
    }
    const brushNode = document.querySelector("g.pane");
    if (!brushNode) {
      return null;
    }
    const selection = d3.brushSelection(brushNode);
    if (!Array.isArray(selection)) {
      return null;
    }
    if (selection.length != 2) {
      return null;
    }
    const [startW, endW] = selection;

    //TODO fix bug when move to end is called the end date is null, similarlu at starting from 0 the start date could be null

    let { startDate, endDate } = this.brushScaleMapReverse(startW, endW);

    if (endDate === null) {
      //this happens whne the selection is right at the right edge, in this case the end date is undefined as it is beyind the last date
      //find last date and set endDate to that...
      const brushChart = this.charts[this.config.brush];
      let domain = brushChart.xScale.domain()
      endDate = domain[domain.length - 1];
    }
    if (startDate == null) {
      //similar situation at the left edge
      const brushChart = this.charts[this.config.brush];
      let domain = brushChart.xScale.domain()
      startDate = domain[0];
    }

    return { startDate, endDate }
  }

  //will return null for starting at the very beginning, or ending at the very end
  getCurrentBrushAccurate() {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return null;
    }
    if (!this.brushed) {
      return null;
    }
    const brushNode = document.querySelector("g.pane");
    if (!brushNode) {
      return null;
    }
    const selection = d3.brushSelection(brushNode);
    if (!Array.isArray(selection)) {
      return null;
    }
    if (selection.length != 2) {
      return null;
    }
    const [startW, endW] = selection;

    //TODO fix bug when move to end is called the end date is null, similarlu at starting from 0 the start date could be null

    let { startDate, endDate } = this.brushScaleMapReverse(startW, endW);


    return { startDate, endDate }
  }

  getCurrentBrushDims(): { startW: number, endW: number } {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return null;
    }
    if (!this.brushed) {
      return null;
    }
    const brushNode = document.querySelector("g.pane")
    if (!brushNode) {
      return null
    }
    const [startW, endW] = d3.brushSelection(brushNode)

    return { startW, endW };
  }


  //the actualDays boolean if set to true will slide the brush by the actual days instead of trading days which is the default.
  slideBrush(days: number, actualDays?: boolean) {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return;
    }
    if (!this.brushed) {
      return;
    }

    let currentSelection = this.getCurrentBrush();
    if (!currentSelection) return;
    const { startDate, endDate } = currentSelection;

    const brushChart = this.charts[this.config.brush];
    //calculate the new start date and end date
    let newStartDate: Date, newEndDate: Date;
    if (actualDays) {
      newStartDate = new Date(startDate);
      newStartDate.setDate(newStartDate.getDate() + days);
      newEndDate = new Date(endDate);
      newEndDate.setDate(newEndDate.getDate() + days);
      this.setBrush(newStartDate, newEndDate);
    } else {
      //get width of a single day
      let origin = brushChart.xScale(startDate);
      let newDate = new Date(startDate);
      let end = brushChart.xScale(newDate);

      while (end == origin) {
        newDate.setDate(newDate.getDate() + 1);
        end = brushChart.xScale(newDate);
      }
      //width of a single day
      const w = end - origin;
      const { startW, endW } = this.getCurrentBrushDims();
      const newStartW = startW + days * w;
      const newEndW = endW + days * w;
      this.setBrushDims(newStartW, newEndW);
    }
  }

  slideBrushRight(days: number, actualDays?: boolean) {
    return this.slideBrush(days, actualDays);
  }
  slideBrushLeft(days: number, actualDays?: boolean) {
    return this.slideBrush(-1 * days, actualDays);
  }


  //the actualDays boolean if set to true will slide the brush by the actual days instead of trading days which is the default.
  expandBrush(days: number, wheelEvent?: WheelEvent, actualDays?: boolean) {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return;
    }
    if (!this.brushed) {
      return;
    }

    let currentSelection = this.getCurrentBrush();
    if (!currentSelection) return;
    const { startDate, endDate } = currentSelection;

    const brushChart = this.charts[this.config.brush];

    //for future use...
    // let leftRightBalance: number; //roughly the days (in terms of pixles) on the right minus the days on the left, to tell us if there are more days on the right (positive value) or more on the left (negative value), or equal (0).
    // if (wheelEvent) {
    //   const { clientX } = wheelEvent;
    //   const centerPointDate = brushChart.xScale.invert(clientX - 50);
    //   const centerPoint = brushChart.xScale(centerPointDate);
    //   const width = brushChart.config.dims.width;
    //   const { startW, endW } = this.getCurrentBrushDims();
    //   leftRightBalance = ((endW || width) - centerPoint) - (centerPoint - (startW || 0));
    // }


    //calculate the new start date and end date
    let newStartDate: Date, newEndDate: Date;
    if (actualDays) {
      newStartDate = new Date(startDate);
      newStartDate.setDate(newStartDate.getDate() - days);
      newEndDate = new Date(endDate);
      newEndDate.setDate(newEndDate.getDate() + days);
      // if (!leftRightBalance || leftRightBalance * days < 0) {
      //   newEndDate.setDate(newEndDate.getDate() + days);
      // }
      // if (!leftRightBalance || leftRightBalance * days > 0) {
      //   newStartDate.setDate(newStartDate.getDate() - days);
      // }      
      this.setBrush(newStartDate, newEndDate);
    } else {
      //get width of a single day
      let origin = brushChart.xScale(startDate);
      let newDate = new Date(startDate);
      let end = brushChart.xScale(newDate);

      while (end == origin) {
        newDate.setDate(newDate.getDate() + 1);
        end = brushChart.xScale(newDate);
      }
      //width of a single day
      const w = end - origin;
      const { startW, endW } = this.getCurrentBrushDims();
      const newStartW = startW - days * w;
      const newEndW = endW + days * w;
      this.setBrushDims(newStartW, newEndW);

      // let newStartW: number, newEndW: number;
      // if (!leftRightBalance || leftRightBalance * days < 0) {
      //   newEndW = endW + days * w;
      // }
      // if (!leftRightBalance || leftRightBalance * days > 0) {
      //   newStartW = startW - days * w;
      // }

      //this.setBrushDims(newStartW || startW, newEndW || endW);
    }
  }

  get brushed(): boolean {
    if (!this.config || !this.config.brush || !this.charts[this.config.brush]) {
      return false;
    }
    let brushNode = document.querySelector("g.pane");
    if (!brushNode) {
      return false;
    }

    let selection = d3.brushSelection(brushNode);
    if (!selection || !Array.isArray(selection) || !(selection.length == 2)) {
      return false;
    }
    return true;
  }

  moveBrushToEnd() {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return;
    }
    if (!this.brushed) {
      return;
    }

    const brushChart = this.charts[this.config.brush]

    const { startW, endW } = this.getCurrentBrushDims();
    const width = endW - startW;

    const newEndW = brushChart.config.dims.width;
    const newStartW = newEndW - width;

    this.setBrushDims(newStartW, newEndW);
  }

  extendBrushToEnd() {
    if (!this.config.brush || !this.charts[this.config.brush]) {
      return;
    }
    if (!this.brushed) {
      return;
    }

    const brushChart = this.charts[this.config.brush]

    const { startW } = this.getCurrentBrushDims();

    const newEndW = brushChart.config.dims.width;

    this.setBrushDims(startW, newEndW);
  }

  getBrushSize(): { tradingDays: number, actualDays: number, width: number, percentage: number } {
    if (!this.brushed) {
      return {
        tradingDays: 0, actualDays: 0, width: 0, percentage: 0
      }
    }

    const { startDate, endDate } = this.getCurrentBrush();
    const { startW, endW } = this.getCurrentBrushDims();
    const brushChart = this.charts[this.config.brush];

    //get width of a single day
    let origin: number = brushChart.xScale(startDate);
    let newDate = new Date(startDate);
    let end: number = brushChart.xScale(newDate);

    while (end == origin) {
      newDate.setDate(newDate.getDate() + 1);
      end = brushChart.xScale(newDate);
    }
    //width of a single day
    const w = end - origin;

    const width = endW - startW;
    const tradingDays = width / w;
    const actualDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const percentage = width / brushChart.config.dims.width * 100
    return { tradingDays, actualDays, width, percentage };
  }

  private renderCallbacks: (() => void)[] = [];
  public onRender(cb: () => void) {
    this.renderCallbacks.push(cb);
  }
  public offRender(fn: () => void) {
    this.renderCallbacks = this.renderCallbacks.filter(cb => cb != fn);
  }
  public onRenderOnce(fn: () => void) {
    let cb = () => {
      fn();
      this.offRender(cb);
    }
    this.onRender(cb);
  }
  public clearRenderCallbacks() {
    this.renderCallbacks = [];
  }

  private renderBeforeCallbacks: (() => void)[] = [];
  public onRenderBefore(cb: () => void) {
    this.renderBeforeCallbacks.push(cb);
  }
  public offRenderBefore(fn: () => void) {
    this.renderBeforeCallbacks = this.renderCallbacks.filter(cb => cb != fn);
  }
  public onRenderBeforeOnce(fn: () => void) {
    let cb = () => {
      fn();
      this.offRenderBefore(cb);
    }
    this.onRenderBefore(cb);
  }
  public clearRenderBeforeCallbacks() {
    this.renderBeforeCallbacks = [];
  }


  renderThrottled = throttle((el, config) => {
    this.render(el, config);
  }, 750)
  render(el: string, config: ChartsConfig) {

    //fconsole.log(JSON.stringify(config));
    this.renderBeforeCallbacks.forEach(cb => cb());
    this.config = config;
    config = cloneDeep(config);
    if (config.overrideBrushNumDays && config.data && config.data.length > config.overrideBrushNumDays) {
      config.data = config.data.slice(-1 * config.overrideBrushNumDays);
    }

    document.querySelector(el).innerHTML = "";
    d3.selectAll(el + " svg > *").remove();

    //set default dims
    if (!config.dims.height) {
      config.dims.height = 0;
      chartTypes.forEach((type) => {
        if (config[type] && config[type].dims.height) {
          config.dims.height += config[type].dims.height;
          if (config[type].dims.margin) {
            config.dims.height +=
              config[type].dims.margin.top + config[type].dims.margin.bottom;
          }
        }
      });
      if (config.dims.margin) {
        config.dims.height +=
          config.dims.margin.top + config.dims.margin.bottom;
      }
    }
    if (!config.dims.width) {
      config.dims.width = window.innerWidth * 0.8;
    }
    if (!config.dims.margin) {
      config.dims.margin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      };
    }

    //main svg element
    config.svg = d3
      .select(el)
      .append("svg")
      .attr(
        "width",
        config.dims.width + config.dims.margin.left + config.dims.margin.right
      )
      .attr(
        "height",
        config.dims.height + config.dims.margin.top + config.dims.margin.bottom
      )
      .append("g")
      .attr(
        "transform",
        "translate(" +
        config.dims.margin.left +
        "," +
        config.dims.margin.top +
        ")"
      );

    //iterate through sequence, make each chart and render it.
    let heightSoFar = 0;
    let brushTargets = [];
    config.sequence.forEach((chartType) => {
      if (config[chartType].hide) {
        return;
      }
      let chartConfig = config[chartType] as ChartConfig;
      if (!chartConfig.data) {
        chartConfig.data = config.data;
      }
      if (!chartConfig.hideYears) {
        if (typeof (config.hideYears) !== "undefined") {
          chartConfig.hideYears = config.hideYears;
        }
      }
      if (!chartConfig.baseYear) {
        if (config.baseYear) {
          chartConfig.baseYear = config.baseYear;
        } else {
          if (config.data) {
            chartConfig.baseYear = +new Date(config.data[0].date).getFullYear();
          } else {
            if (chartConfig.data){
            chartConfig.baseYear = +new Date(chartConfig.data[0].date).getFullYear();
            }else{console.error('chartConfig.data undef')}
          }
        }
      }
      chartConfig.parentSvg = config.svg;
      chartConfig.parentDims = config.dims;

      /**/
      if (config.brush == chartType) {
        //this chart will be a brush chart
        chartConfig._brush = true;
        chartConfig.brushTargets = brushTargets;
      } else {
        chartConfig._brush = false;
      }

      if (!chartConfig.dims.margin) {
        chartConfig.dims.margin = config.dims.margin;
        chartConfig.dims.margin.top = 0;
        chartConfig.dims.margin.bottom = 0;
      }

      chartConfig.dims.margin.top += heightSoFar;
      heightSoFar =
        chartConfig.dims.height +
        chartConfig.dims.margin.top +
        chartConfig.dims.margin.bottom;
      chartConfig.internalClassName =
        "z" + (Math.random() + 1).toString(36).substring(7);
      let chart: Chart = new chartMap[chartType](chartConfig, this);
      this.charts[chartType] = chart;
      chart.render();

      // window[chartType] = chart;
      if (!chartConfig._brush && chartConfig.brushed) {
        brushTargets.push({
          scale: chart.xScale,
          update: chart.update.bind(chart),
          chart: chart,
        });
      }
    });
    this.renderCallbacks.forEach(cb => cb());
    if (config.overrideBrushNumDays && config.brush && config[config.brush] && config[config.brush].data && config[config.brush].data.close && config[config.brush].data.close.length > config.overrideBrushNumDays) {
      this.setBrush(config.data[0].date);
    }

  }
}

class Chart {
  data: Data;
  xScale: any;
  yScale: d3.ScaleLinear<number, number>;
  xAxis: d3.Axis<any>;
  yAxis: d3.Axis<any>;
  svg: d3.Selection<SVGGElement, any, HTMLElement, any>;
  crosshair: any;
  baseYear: number;
  brush?: d3.BrushBehavior<any>;
  chartSvg?: d3.Selection<SVGGElement, any, HTMLElement, any>


  constructor(public config: ChartConfig, public chartsProvider: ChartsProvider) {
    if (!this.config.dims.height) {
      this.config.dims.height = 200;
    }
    if (!this.config.dims.width) {
      this.config.dims.width = this.config.parentDims.width;
    }
    if (!this.config.dims.margin) {
      this.config.dims.margin = this.config.parentDims.margin;
    }

    if (this.config.data) {
      this.data = this.config.data;
    }

    if (this.config.baseYear) {
      this.baseYear = this.config.baseYear;
    }
  }

  public getData(d: Date): any { }

  public isIndicator(): boolean {
    return false;
  }

  public render() {
    if (!this.config.hide) {
      this.draw();
      this.hideYears();
    }
  }

  hideYears() {
    if (this.config.hideYears) {
      let re = new RegExp("^\\s*((19|20)[0-9][0-9])\\s*$");
      let re2 = new RegExp("^...\\s((19|20)[0-9][0-9])\\s*$");
      let firstYear: number = this.baseYear;

      Array.from(
        document.querySelectorAll(
          "." + this.config.internalClassName + ".x, .hide-years"
        )
      ).forEach((el) => {
        Array.from(el.querySelectorAll("text")).forEach((el, i) => {
          if (re.test(el.innerHTML)) {
            let year = +el.innerHTML.replace(re, "$1") - firstYear + 1;
            el.innerHTML = "Yr " + year;
          }
          if (re2.test(el.innerHTML)) {
            let year = +el.innerHTML.replace(re2, "$1") - firstYear + 1;
            el.innerHTML =
              el.innerHTML.replace(/(.*)\s((19|20)[0-9][0-9])(.*)/g, "$1") +
              ", Yr " +
              year;
          }
        });
      });
    }
  }

  drawCrosshair() {
    if (!this.config.crossHair) {
      return;
    }

    this.crosshair = techan.plot
      .crosshair()
      .xScale(this.xScale)
      .yScale(this.yScale);

    const ohlcAnnotation = techan.plot
      .axisannotation()
      .axis(this.yAxis)
      .orient("left")
      .format(d3.format(",.2f"));

    const timeAnnotation = techan.plot
      .axisannotation()
      .axis(this.xAxis)
      .orient("bottom")
      .format(yearsFormatter(this.baseYear, this.config.hideYears))
      .width(65)
      .translate([0, this.config.dims.height]);

    this.crosshair.xAnnotation(timeAnnotation).yAnnotation(ohlcAnnotation);

    this.svg.append("g").attr("class", "crosshair").call(this.crosshair);
  }

  draw() {
    this.xScale = techan.scale.financetime().range([0, this.config.dims.width]);
    this.yScale = d3.scaleLinear().range([this.config.dims.height, 0]);
    this.yAxis = d3.axisLeft(this.yScale);
    applyTicks(this.yAxis, this.config.leftAxisTicks);
    this.svg = this.config.parentSvg;
  }

  update() {
    applyTicks(this.xAxis, this.config.bottomAxisTicks);
    applyTicks(this.yAxis, this.config.leftAxisTicks);
  }

  postupdate() {
    this.hideYears();
  }
}

class Candlestick extends Chart {
  data: DataOhlc;
  xAxis: d3.Axis<number>;
  xAxisTop: d3.Axis<number>;
  yAxisRight: d3.Axis<number>;
  yAxisVolume: d3.Axis<number>;
  chart: any;
  volume: any;
  yVolumeScale: d3.ScaleLinear<number, number>;
  yPercentScale: d3.ScaleLinear<number, number>;
  smas: any[] = [];
  emas: any[] = [];
  bollingers: any[] = [];
  atrTrailingStops: any[] = [];
  ichimoku: any;
  tradearrow: any;
  tradeText: d3.Selection<SVGTextElement, any, HTMLElement, any>;
  clipURL: string;
  candlestickData: CandlestickData;
  supstance: any;

  constructor(public config: CandlestickConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
    this.clipURL = "clip-candlestick" + this.config.internalClassName;
    //hide indicator pre-roll to get the charts in sync
    //this.data = this.data.slice(33);
    this.candlestickData = {
      ohlc: this.data,
    };
  }

  getData(date: any) {
    super.getData(date);
    return filterByDate(this.candlestickData, date);
  }

  drawLeadingIndicators() {
    ["DXY", "Unemployment", "Housing", "Yield", "SnP", "Industry", "VIX", "Recessions"].forEach(li => {
      if (this.config[li]) {

        if (li == "Recessions") {
          //let data = sanitizeLeadingIndicator(li);

          // let data = [{
          //   start: new Date(2019, 0, 1),
          //   end: new Date(2019, 0, 10)
          // },
          // {
          //   start: new Date(2019, 3, 1),
          //   end: new Date(2019, 3, 10)
          // },
          // {
          //   start: new Date(2019, 6, 1),
          //   end: new Date(2019, 6, 10)
          // },
          // {
          //   start: new Date(2019, 9, 1),
          //   end: new Date(2019, 9, 10)
          // }
          // ]

          let data = sanitizeLeadingIndicator(li);

          var g = this.svg.append("g")
            .attr("transform", "translate(0,0)")
            .attr("clip-path", `url(#${this.clipURL})`)
            .attr("class", "leading-indicator")
            .attr("class", "indicator")
            .attr("class", "recession-indicator");
          let xScale = this.xScale;

          g.selectAll("." + li)
            .data(data)
            .enter().append("rect")
            .attr("class", "Recessions")
            .attr("x", (d: any) => { return xScale(d.start); })
            .attr("y", "-1000")
            .attr("width", (d: any) => (xScale(d.end) - xScale(d.start)))
            .attr("height", "2000");
          return;
        }


        let leadingScale = this.yScale.copy();



        let data = sanitizeLeadingIndicator(li);
        data = data.map((d) => {
          return {
            date: d.date,
            open: +d.value,
            high: +d.value,
            low: +d.value,
            close: +d.value,
            volume: 0,
          };
        });

        this[li] = techan.plot.close().xScale(this.xScale).yScale(leadingScale);
        leadingScale.domain(
          techan.scale.plot.ohlc(data, this[li].accessor()).domain()
        );
        this.svg
          .append("g")
          .attr(
            "class",
            "indicator leading-indicator " + li + " " + this.config.internalClassName
          )
          .attr("clip-path", `url(#${this.clipURL})`);

        this.svg.selectAll(`g.leading-indicator.${li}.${this.config.internalClassName}`).datum(data).call(this[li]);
      }
    });

  }



  refreshLeadingIndicators = () => {
    let xScale = this.xScale;
    ["DXY", "Unemployment", "Housing", "Yield", "SnP", "Industry", "VIX", "Recessions"].forEach(li => {
      if (this.config[li]) {
        let data = sanitizeLeadingIndicator(li);
        if (li == "Recessions") {
         //data = window["recessionData"] || data;
          var g = this.svg.select("g.recession-indicator");
          g.selectAll("." + li)
            .remove()
            .exit()
            .data(data)
            .enter().append("rect")
            .attr("class", "Recessions")
            .attr("x", (d: any) => { return xScale(d.start); })
            .attr("y", "-1000")
            .attr("width", (d: any) => (xScale(d.end) - xScale(d.start)))
            .attr("height", "2000");
          return;
        }
        let leadingScale = this.yScale.copy();

        data = data.map((d) => {
          return {
            date: d.date,
            open: +d.value,
            high: +d.value,
            low: +d.value,
            close: +d.value,
            volume: 0,
          };
        });

        this[li] = techan.plot.close().xScale(this.xScale).yScale(leadingScale);
        leadingScale.domain(
          techan.scale.plot.ohlc(data, this[li].accessor()).domain()
        );
        this.svg
          .append("g")
          .attr(
            "class",
            "indicator leading-indicator " + li + " " + this.config.internalClassName
          )
          .attr("clip-path", `url(#${this.clipURL})`);

        this.svg.selectAll(`g.leading-indicator.${li}.${this.config.internalClassName}`).datum(data).call(this[li]);


        const labelDiv = d3
          .select("body")
          .append("div")
          .attr("class", "dynamic-label-leading dynamic-label-" + li)
          .style("opacity", 0);

        const showTooltip = (text: string) => {
          return function (data) {
            let dt = xScale.invert(d3.event.offsetX - 50);
            //let val = data.find(x => +x.date == +dt)
            //console.log(`val = ${val}`)
            //if (!val) {
            let val = leadingScale.invert(d3.event.offsetY - 10);
            //}
            const displayVal = Math.round(val * 100) / 100
            labelDiv.transition().duration(0).style("opacity", 0.9);
            labelDiv
              .html(displayVal)
              .style("left", d3.event.pageX - 30 + "px")
              .style("top", d3.event.pageY + 14 + "px");
          };
        };

        const hideTooltip = () => {
          return function () {
            labelDiv.transition().duration(2000).style("opacity", 0);
          };
        };

        const addTooltip = (selector: string, text: string = "") => {
          let selection = d3.selectAll(selector)
          selection
            .on("mouseover", showTooltip(text))
            .on("mouseout", hideTooltip());
        };

        const removeTooltip = (selector: string) => {
          let selection = d3.selectAll(selector)
          selection
            .on('mouseover', null)
            .on("mouseout", null);
        }
        addTooltip(`g.leading-indicator.${li}.${this.config.internalClassName}`, li)
      }
    });
  }

  drawSupstance() {
    if (!this.config.supstance || !this.config.supstance.show) {
      return;
    }
    const supData = this.calculateSupstanceData();
    this.svg
      .append("g")
      .attr(
        "class",
        "indicator supstance-indicator " + this.config.internalClassName
      )
      .attr("clip-path", `url(#${this.clipURL})`);


    const ohlcAnnotation = techan.plot.axisannotation()
      .axis(this.yAxis)
      .orient('right')
      .format(d3.format(',.1f'))
      ;

    const labelDiv = d3
      .select("body")
      .append("div")
      .attr("class", "dynamic-label-supstance")
      .style("opacity", 0);

    const showTooltip = (text: string) => {
      return function ({ value }) {
        const displayVal = text// + " " + Math.round(value * 100) / 100
        labelDiv.transition().duration(0).style("opacity", 0.9);
        labelDiv
          .html(displayVal)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      };
    };

    const hideTooltip = () => {
      return function () {
        labelDiv.transition().duration(2000).style("opacity", 0);
      };
    };

    const addTooltip = (selector: string, index: number = 0, text: string = "") => {
      let selection = d3.select(d3.selectAll(selector).filter((_, i) => i == index).node().parentNode);
      selection
        .on("mouseover", showTooltip(text))
        .on("mouseout", hideTooltip());
    };

    const removeTooltip = (selector: string, index: number = 0) => {
      let selection = d3.select(d3.selectAll(selector).filter((_, i) => i == index).node().parentNode)
      selection
        .on('mouseover', null)
        .on("mouseout", null);
    }

    this.supstance = techan.plot.supstance()
      .xScale(this.xScale)
      .yScale(this.yScale)
      .annotation([ohlcAnnotation])
    //.on("mouseenter", showTooltip(""))
    //.on("mouseout", hideTooltip())
    //.on("drag", drag);

    this.svg.selectAll("g.supstance-indicator." + this.config.internalClassName).datum(supData).call(this.supstance);

    let paths = document.querySelectorAll(".supstance>path") as NodeListOf<HTMLElement>;
    let annots = document.querySelectorAll(".supstance~.axisannotation") as NodeListOf<HTMLElement>
    let labels = this.config.supstance.labels;
    let { visibility, color, annotationVisibility } = this.config.supstance;
    [visibility, color, annotationVisibility].forEach(x => { if (!x) { x = [] } });
    if (visibility && Array.isArray(visibility)) {
      visibility.forEach((v, i) => {
        if (paths[i]) {
          paths[i].style.opacity = v ? "100%" : "0%";
          if (v) {
            addTooltip(`.supstance`, i, labels[i]);
          } else {
            removeTooltip(`.supstance`, i);
          }
        }
        if (annots[i]) {
          annots[i].style.opacity = v && annotationVisibility[i] ? "100%" : "0%";
        }
      })
    }
    if (color && Array.isArray(color)) {
      color.forEach((c, i) => {
        if (paths[i]) {
          paths[i].style.stroke = c;
        }
      })
    }
  }


  refreshSupstance() {
    if (!this.config.supstance || !this.config.supstance.show) {
      return;
    }
    const supData: SupData = this.calculateSupstanceData();
    this.svg.selectAll("g.supstance-indicator." + this.config.internalClassName).datum(supData).call(this.supstance);
  }

  calculateSupstanceData(): SupData {
    const supData = Supstance.calculate(this.data, this.config.supstance.algorithmConfig);
    this.candlestickData.supstance = supData;
    let outData: SupData = [];
    supData.forEach(line => {
      if (line === null) {
        return;
      }

      if (typeof (line) == "number") {
        outData.push({ value: line });
      }

      if (Array.isArray(line)) {
        if (line.length == 3) {
          if (typeof (line[2]) === "number") {
            // @ts-ignore
            let dist: number = line[2] / 2;
            let chartData = this.config.data
            let targetIndex = chartData.findIndex(x => {
              return (x.date.getTime() == line[1].getTime());
            });
            if (typeof targetIndex === "undefined") {
              return;
            }

            const adjustIndex = (index: number) => {
              let minIndex = 0;
              let maxIndex = this.config.data.length - 1;
              return Math.max(Math.min(Math.round(index), maxIndex), minIndex);
            }

            let startIndex = adjustIndex(targetIndex - dist);
            let endIndex = adjustIndex(targetIndex + dist);

            outData.push({ value: line[0], start: this.config.data[startIndex].date, end: this.config.data[endIndex].date })
          } else {
            // @ts-ignore
            outData.push({ value: line[0], start: line[1], end: line[2] as Date });
          }
        }
      }
    });
    return outData
  }

  drawBollinger() {
    if (!this.config.bollinger || this.config.bollinger.length == 0) {
      return;
    }
    this.candlestickData.bollinger = {};
    this.config.bollinger.forEach((period, i) => {
      let bollingeri = techan.plot
        .bollinger()
        .xScale(this.xScale)
        .yScale(this.yScale);
      const indicator = techan.indicator.bollinger().period(period);
      if (this.config.bollingerSdMultiplication) {
        indicator.sdMultiplication(this.config.bollingerSdMultiplication);
      }
      this.candlestickData.bollinger[period] = indicator(this.data);
      this.bollingers.push(bollingeri);
      this.svg
        .append("g")
        .attr(
          "class",
          "indicator bollinger boll-" + i + " " + this.config.internalClassName
        )
        .attr("transform", "translate(0," + this.config.dims.margin.top + ")")
        .attr("clip-path", `url(#${this.clipURL})`);

      this.svg
        .select("g.bollinger.boll-" + i + "." + this.config.internalClassName)
        .datum(this.candlestickData.bollinger[period])
        .call(bollingeri);
    });
  }

  refreshBollinger() {
    if (!this.config.bollinger || this.config.bollinger.length == 0) {
      return;
    }
    this.config.bollinger.forEach((bollinger, i) => {
      this.svg
        .select("g.bollinger.boll-" + i + "." + this.config.internalClassName)
        .call(this.bollingers[i].refresh);
    });
  }

  drawAtrTrailingStop() {
    if (
      !this.config.atrTrailingStop ||
      this.config.atrTrailingStop.length == 0
    ) {
      return;
    }
    this.candlestickData.atrTrailingStop = {};
    this.config.atrTrailingStop.forEach((period, i) => {
      let atrTrailingStopi = techan.plot
        .atrtrailingstop()
        .xScale(this.xScale)
        .yScale(this.yScale);
      const indicator = techan.indicator.atrtrailingstop().period(period);
      if (this.config.atrTrailingStopMultiplier) {
        indicator.multiplier(this.config.atrTrailingStopMultiplier);
      }
      this.candlestickData.atrTrailingStop[period] = indicator(this.data);
      this.atrTrailingStops.push(atrTrailingStopi);
      this.svg
        .append("g")
        .attr(
          "class",
          "indicator atrtrailingstop atrts-" +
          i +
          " " +
          this.config.internalClassName
        )
        .attr("transform", "translate(0," + this.config.dims.margin.top + ")")
        .attr("clip-path", `url(#${this.clipURL})`);

      this.svg
        .select(
          "g.atrtrailingstop.atrts-" + i + "." + this.config.internalClassName
        )
        .datum(this.candlestickData.atrTrailingStop[period])
        .call(atrTrailingStopi);
    });
  }

  refreshAtrTrailingStop() {
    if (
      !this.config.atrTrailingStop ||
      this.config.atrTrailingStop.length == 0
    ) {
      return;
    }
    this.config.atrTrailingStop.forEach((atrTrailingStop, i) => {
      this.svg
        .select(
          "g.atrtrailingstop.atrts-" + i + "." + this.config.internalClassName
        )
        .call(this.atrTrailingStops[i].refresh);
    });
  }

  drawIchimoku() {
    if (!this.config.ichimoku) {
      return;
    }
    this.candlestickData.ichimoku = {};
    let ichimokui = techan.plot
      .ichimoku()
      .xScale(this.xScale)
      .yScale(this.yScale);

    const indicator = techan.indicator.ichimoku();
    if (this.config.tenkanSen) {
      indicator.tenkanSen(this.config.tenkanSen);
    }

    if (this.config.senkouSpanB) {
      indicator.senkouSpanB(this.config.senkouSpanB);
    }

    if (this.config.kijunSen) {
      indicator.kijunSen(this.config.kijunSen);
    }

    this.candlestickData.ichimoku = indicator(this.data);
    this.ichimoku = ichimokui;
    this.svg
      .append("g")
      .attr("class", "indicator ichimoku " + this.config.internalClassName)
      .attr("transform", "translate(0," + this.config.dims.margin.top + ")")
      .attr("clip-path", `url(#${this.clipURL})`);

    this.svg
      .select("g.ichimoku" + "." + this.config.internalClassName)
      .datum(this.candlestickData.ichimoku)
      .call(ichimokui);
  }
  refreshIchimoku() {
    if (!this.config.ichimoku) {
      return;
    }

    this.svg
      .select("g.ichimoku." + this.config.internalClassName)
      .call(this.ichimoku.refresh);
  }

  drawSMA() {
    if (!this.config.sma || this.config.sma.length == 0) {
      return;
    }
    this.candlestickData.sma = {};
    this.config.sma.forEach((period, i) => {
      let smai = techan.plot.sma().xScale(this.xScale).yScale(this.yScale);
      this.candlestickData.sma[period] = techan.indicator.sma().period(period)(
        this.config.data
      );
      this.smas.push(smai);
      this.svg
        .append("g")
        .attr(
          "class",
          "indicator sma ma-" + i + " " + this.config.internalClassName
        )
        .attr("transform", "translate(0," + this.config.dims.margin.top + ")")
        .attr("clip-path", `url(#${this.clipURL})`);

      this.svg
        .select("g.sma.ma-" + i + "." + this.config.internalClassName)
        .datum(this.candlestickData.sma[period])
        .call(smai);
    });
  }

  refreshSMA() {
    if (!this.config.sma || this.config.sma.length == 0) {
      return;
    }
    this.config.sma.forEach((sma, i) => {
      this.svg
        .select("g .sma.ma-" + i + "." + this.config.internalClassName)
        .call(this.smas[i].refresh);
    });
  }

  drawEMA() {
    if (!this.config.ema || this.config.ema.length == 0) {
      return;
    }
    this.candlestickData.ema = {};
    this.config.ema.forEach((period, i) => {
      let emai = techan.plot.ema().xScale(this.xScale).yScale(this.yScale);
      this.candlestickData.ema[period] = techan.indicator.ema().period(period)(
        this.config.data
      );
      this.emas.push(emai);
      this.svg
        .append("g")
        .attr(
          "class",
          "indicator ema ma-" + i + " " + this.config.internalClassName
        )
        .attr("transform", "translate(0," + this.config.dims.margin.top + ")")
        .attr("clip-path", `url(#${this.clipURL})`);

      this.svg
        .select("g.ema.ma-" + i + "." + this.config.internalClassName)
        .datum(this.candlestickData.ema[period])
        .call(emai);
    });
  }

  refreshEMA() {
    if (!this.config.ema || this.config.ema.length == 0) {
      return;
    }
    this.config.ema.forEach((ema, i) => {
      this.svg
        .select("g .ema.ma-" + i + "." + this.config.internalClassName)
        .call(this.emas[i].refresh);
    });
  }

  noTrades() {
    return (
      !this.config.showTrades ||
      !this.config.trades ||
      this.config.trades.length == 0
    );
  }

  drawTrades() {
    if (this.noTrades()) {
      return;
    }
    const dateFormat = d3.timeFormat("%d-%b"),
      valueFormat = d3.format(",.2f");
    const yearFormat = d3.timeFormat("%Y");

    this.svg
      .append("g")
      .attr("class", "tradearrow " + this.config.internalClassName)
      .attr("clip-path", `url(#${this.clipURL})`);


    this.tradeText = this.svg 
      .append("text")
      .style("text-anchor", "end")
      .attr("class", "coords " + this.config.internalClassName)
      .attr("x", this.config.dims.width - 5)
      .attr("y", 15);

    const enter = (d) => {
      this.tradeText.style("display", "inline");
      const year = this.config.hideYears
        ? "Yr " + (+yearFormat(d.date) - this.baseYear + 1)
        : yearFormat(d.date);
      this.tradeText.text(dateFormat(d.date) +
        ", " +
        year +
        " | " +
        d.type.toUpperCase() +
        " @ $" +
        valueFormat(d.price)
      );
    };

    const out = () => {
      this.tradeText.style("display", "none");
    };

    this.tradearrow = techan.plot
      .tradearrow()
      .xScale(this.xScale)
      .yScale(this.yScale)
      .orient(function (d) {
        return d.type.startsWith("buy") ? "up" : "down";
      })
      .on("mouseenter", enter)
      .on("mouseout", out);
  }
  refreshTrades() {
    if (this.noTrades()) {
      return;
    }
    this.svg
      .selectAll("g.tradearrow")
      .datum(this.config.trades)
      .call(this.tradearrow);
  }

  drawVolume() {
    if (!this.config.showVolume) {
      return;
    }
    this.yVolumeScale = d3
      .scaleLinear()
      .range([this.yScale(0), this.yScale(0.3)]);

    this.volume = techan.plot
      .volume()
      .xScale(this.xScale)
      .yScale(this.yVolumeScale);

    this.svg
      .append("g")
      .attr("class", "volume " + this.config.internalClassName)
      .attr("clip-path", `url(#${this.clipURL})`);

    this.yVolumeScale.domain(
      techan.scale.plot.volume(this.config.data).domain()
    );
    this.svg
      .select("g.volume." + this.config.internalClassName)
      .datum(this.config.data);
  }

  refreshVolume() {
    if (!this.config.showVolume) {
      return;
    }

    //use this if you want non-normalised y volumes
    // this.yVolumeScale.domain(
    //   techan.scale.plot.volume(this.config.data).domain()
    // );

    //normalised y-volume

    const brushedData = Array.prototype.slice.apply(
      this.config.data,
      this.xScale.zoomable().domain()
    );
    // console.log("brushed data: ", brushedData);
    // console.log(
    //   "volume domain:",
    //   techan.scale.plot.volume(brushedData).domain()
    // );

    this.yVolumeScale.domain(techan.scale.plot.volume(brushedData).domain());

    this.svg
      .select("g.volume." + this.config.internalClassName)
      .call(this.volume);
  }

  drawCrosshair() {
    //super.drawCrosshair();

    this.crosshair = techan.plot
      .crosshair()
      .xScale(this.xScale)
      .yScale(this.yScale);

    const xAnnotationArr = [];
    const yAnnotationArr = [];

    if (this.config.showRightAxis) {
      const ohlcAnnotation = techan.plot
        .axisannotation()
        .axis(this.yAxisRight)
        .orient("right")
        .format(d3.format(",.2f"))
        .translate([this.xScale(1), 0]);
      yAnnotationArr.push(ohlcAnnotation);
    }

    if (this.config.showVolume) {
      const volumeAnnotation = techan.plot
        .axisannotation()
        .axis(this.yAxisVolume)
        .orient("right")
        .format(billionsFormatter());
      yAnnotationArr.push(volumeAnnotation);
    }

    const percentageAnnotation = techan.plot
      .axisannotation()
      .axis(this.yAxis)
      .orient("left")
      .format(d3.format("+.1%"));
    const priceAnnotation = techan.plot
      .axisannotation()
      .axis(this.yAxis)
      .orient("left")
      .format(d3.format(",.2f"));
    let leftAxisAnnotation;
    if (this.config.showPriceInLeftAxis) {
      leftAxisAnnotation = priceAnnotation;
    } else {
      leftAxisAnnotation = percentageAnnotation;
    }

    yAnnotationArr.push(leftAxisAnnotation);

    if (!this.config.hideXAxis) {
      const timeAnnotation = techan.plot
        .axisannotation()
        .axis(this.xAxis)
        .orient("bottom")
        .format(yearsFormatter(this.baseYear, this.config.hideYears))
        .width(65)
        .translate([0, this.config.dims.height]);
      xAnnotationArr.push(timeAnnotation);
    }

    if (this.config.showTopAxis) {
      const timeAnnotationTop = techan.plot
        .axisannotation()
        .axis(this.xAxis)
        .orient("top")
        .format(d3.timeFormat("%a, %e %b"))
        .width(65);
      xAnnotationArr.push(timeAnnotationTop);
    }

    this.crosshair.xAnnotation(xAnnotationArr).yAnnotation(yAnnotationArr);

    this.svg.append("g").attr("class", "crosshair").call(this.crosshair);

    if (!this.config.crossHair) {
      return;
    }
  }

  drawAxisTop() {
    if (!this.config.showTopAxis) {
      return;
    }
    this.xAxisTop = d3.axisTop(this.xScale);
    applyTicks(this.xAxisTop, this.config.topAxisTicks);
    this.svg
      .append("g")
      .attr(
        "class",
        "x axis top candlestick-axis hide-years " +
        this.config.internalClassName
      );
  }

  refreshAxisTop() {
    if (!this.config.showTopAxis) {
      return;
    }
    this.svg
      .selectAll(
        "g.x.axis.top.candlestick-axis." + this.config.internalClassName
      )
      .call(this.xAxisTop); 
  }

  drawAxisRight() {
    if (!this.config.showRightAxis) {
      return;
    }
    this.yAxisRight = d3.axisRight(this.yScale);
    applyTicks(this.yAxisRight, this.config.rightAxisTicks);
    this.svg
      .append("g")
      .attr(
        "class",
        "y axis right candlestick-axis " + this.config.internalClassName
      )
      .attr("transform", "translate(" + this.config.dims.width + ",0)")
      .append("text")
      .attr("transform", "translate(28," + this.config.dims.margin.top + ")")
      .attr("y", 6)
      .attr("dy", "-2.1em")
      .style("text-anchor", "end")
      .text(this.config.rightAxisLabel || "Price");
  }

  refreshAxisRight() {
    if (!this.config.showRightAxis) {
      return;
    }
    this.svg
      .selectAll(
        "g.y.axis.right.candlestick-axis." + this.config.internalClassName
      )
      .call(this.yAxisRight);
  }

  drawAxisVolume() {
    if (!this.config.showVolume) {
      return;
    }
    this.yAxisVolume = d3
      .axisRight(this.yVolumeScale)
      .tickFormat(billionsFormatter(",.2s"));
    applyTicks(this.yAxisVolume, this.config.volumeAxisTicks);
    this.svg
      .append("g")
      .attr(
        "class",
        "y axis volume-axis candlestick-axis " + this.config.internalClassName
      )
      .attr("transform", "rotate(-90)")
      .attr("transform", "translate(0," + this.config.dims.margin.top + ")");
  }

  refreshAxisVolume() {
    if (!this.config.showVolume) {
      return;
    }
    this.svg
      .selectAll("g.y.axis.volume-axis." + this.config.internalClassName)
      .call(this.yAxisVolume);
  }

  drawAxisBottom() {
    this.xAxis = d3.axisBottom(this.xScale);
    applyTicks(this.xAxis, this.config.bottomAxisTicks);
    const height = this.config.dims.height;
    const marginTop = this.config.dims.margin.top;
    if (!this.config.hideXAxis) {
      this.svg
        .append("g")
        .attr(
          "class",
          "x axis bottom candlestick-axis " + this.config.internalClassName
        )
        .attr("transform", "translate(0," + marginTop + height + ")");
    }
  }
  refreshAxisBottom() {
    if (!this.config.hideXAxis) {
      this.svg
        .selectAll(
          "g.x.axis.candlestick-axis.bottom." + this.config.internalClassName
        )
        .call(this.xAxis);
    }
  }

  drawAxisLeft() {

    if (this.config.showPriceInLeftAxis) {
      this.yAxis = d3.axisLeft(this.yScale);
    } else {
      this.yAxis = d3.axisLeft(this.yPercentScale).tickFormat(d3.format("+.1%"));
    }
    applyTicks(this.yAxis, this.config.leftAxisTicks);
    const yAxisSvg = this.svg
      .append("g")
      .attr(
        "class",
        "y axis left candlestick-axis " + this.config.internalClassName
      );

    const yLabel = this.config.yLabel || this.config.showPriceInLeftAxis ? "Price" : "Percent";
    const marginTop = this.config.dims.margin.top;
    yAxisSvg
      .append("text")
      .attr("transform", "translate(0," + marginTop + ")")
      .attr("y", 6)
      .attr("dy", "-2.1em")
      .style("text-anchor", "end")
      .text(yLabel);
  }
  refreshAxisLeft() {
    this.svg
      .selectAll(
        "g.y.axis.candlestick-axis.left." + this.config.internalClassName
      )
      .call(this.yAxis);
  }

  drawChart() {
    this.chart = techan.plot
      .candlestick()
      .xScale(this.xScale)
      .yScale(this.yScale);

    // const accessor = this.candlestick.accessor();

    // const data = this.config.data.sort((a, b) =>
    //   d3.ascending(accessor.d(a), accessor.d(b))
    // );

    this.svg
      .append("clipPath")
      .attr("id", this.clipURL)
      .append("rect")
      .attr("x", 0)
      .attr("y", this.yScale(1))
      .attr("width", this.config.dims.width)
      .attr("height", this.yScale(0) - this.yScale(1));

    const marginTop = this.config.dims.margin.top;
    this.svg
      .append("g")
      .attr("class", "candlestick " + this.config.internalClassName)
      .attr("transform", "translate(0," + marginTop + ")")
      .attr("clip-path", `url(#${this.clipURL})`);
  }

  refreshChart() {
    this.svg
      .selectAll("g.candlestick." + this.config.internalClassName)
      .datum(this.config.data)
      .call(this.chart);
  }

  drawScales() {
    //skip the first two weeks of data to get indicator sync. Indicator data starts after 2 weeks and we wnat the indiactor axes to be in sync with the other data axes. So we skip the initial data.
    //UPDATE we are no longer diong this
    //if the preroll cut off strategy is desired then enable this again and instead of 14 use the greatest period.
    //this.xScale.domain(this.config.data.slice(14).map(this.chart.accessor().d));
    this.xScale.domain(this.config.data.map(this.chart.accessor().d));

    this.yScale.domain(
      techan.scale.plot
        .ohlc(this.config.data.slice(14), this.chart.accessor())
        .domain()
    );
  }
  refreshScales() {
    this.yScale.domain(
      techan.scale.plot
        .ohlc(
          this.config.data.slice.apply(
            this.config.data,
            this.xScale.zoomable().domain()
          ),
          this.chart.accessor()
        )
        .domain()
    );

    this.yPercentScale.domain(
      techan.scale.plot.percent(this.yScale, this.data[0].close).domain()
    );
  }

  //update: this is not being used.
  applyAllTicks() {
    //TODO is this required?
    applyTicks(this.xAxis, this.config.bottomAxisTicks);
    applyTicks(this.yAxis, this.config.leftAxisTicks);
    applyTicks(this.yAxisVolume, this.config.volumeAxisTicks);
    applyTicks(this.xAxisTop, this.config.topAxisTicks);
    applyTicks(this.yAxisRight, this.config.rightAxisTicks);
  }

  draw() {
    if (this.config.hide) {
      return;
    }
    super.draw();

    //this order matters!
    this.yPercentScale = d3.scaleLinear().range([this.config.dims.height, 0]);
    this.drawAxisLeft();
    this.drawAxisBottom();
    this.drawChart();
    this.drawAxisTop();
    this.drawAxisRight();
    this.drawBollinger();
    this.drawIchimoku();
    this.drawAtrTrailingStop();
    this.drawSMA();
    this.drawEMA();
    this.drawVolume();
    this.drawAxisVolume();
    this.drawCrosshair();
    this.drawTrades();
    this.drawScales();
    this.drawSupstance();
    this.drawLeadingIndicators();


    this.update();
  }

  update() {
    super.update();
    this.refreshScales();
    this.refreshChart();
    this.refreshAxisBottom();
    this.refreshAxisLeft();
    this.refreshAxisTop();
    this.refreshAxisRight();
    this.refreshBollinger();
    this.refreshIchimoku();
    this.refreshAtrTrailingStop();
    this.refreshSMA();
    this.refreshEMA();
    this.refreshTrades();
    this.refreshVolume();
    this.refreshAxisVolume();
    this.refreshSupstance();
    this.refreshLeadingIndicators();
    super.postupdate();
  }
}

class Ohlc extends Candlestick {
  clipURL: string;
  constructor(config: OhlcConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
    this.clipURL = "clip-ohlc-" + this.config.internalClassName;
  }

  drawChart() {
    this.chart = techan.plot.ohlc().xScale(this.xScale).yScale(this.yScale);

    // const accessor = this.candlestick.accessor();

    // const data = this.config.data.sort((a, b) =>
    //   d3.ascending(accessor.d(a), accessor.d(b))
    // );

    this.svg
      .append("clipPath")
      .attr("id", this.clipURL)
      .append("rect")
      .attr("x", 0)
      .attr("y", this.yScale(1))
      .attr("width", this.config.dims.width)
      .attr("height", this.yScale(0) - this.yScale(1));

    const marginTop = this.config.dims.margin.top;
    this.svg
      .append("g")
      .attr("class", "candlestick " + this.config.internalClassName)
      .attr("transform", "translate(0," + marginTop + ")")
      .attr("clip-path", `url(#${this.clipURL})`);
  }

  refreshChart() {
    this.svg
      .selectAll("g.candlestick." + this.config.internalClassName)
      .datum(this.config.data)
      .call(this.chart);
  }

  draw() {
    super.draw();
  }
}

class Portfolio extends Chart {
  data: { portfolio: DataValues; close: DataOhlc; adjClose: DataValues };
  config: PortfolioConfig;
  portfolio: any;
  close: any;
  adjClose: any;
  portfolioData: DataOhlc;
  scaledPortfolioData: DataOhlc;
  closeData: DataOhlc;
  scaledCloseData: DataOhlc;
  adjCloseData: DataOhlc;
  scaledAdjCloseData: DataOhlc;
  chartSvg: any;
  brush: any;
  yPercentScale: d3.ScaleLinear<number, number>;
  yAxisRight: d3.Axis<number>;

  constructor(config: PortfolioConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
    //hide indicator pre-roll to get the charts in sync
    //this.data = this.data.slice(33);
  }

  getData(date: Date): any {
    super.getData(date);
    return filterByDate(this.data, date);
  }

  drawAxisRight() {
    if (!this.config.showRightAxis) {
      return;
    }
    this.yAxisRight = d3
      .axisRight(this.yPercentScale)
      .tickFormat(d3.format("+.1%"));
    applyTicks(this.yAxisRight, this.config.rightAxisTicks);
    this.chartSvg
      .append("g")
      .attr(
        "class",
        "y axis portfolio-axis right " + this.config.internalClassName
      )
      .attr("transform", "translate(" + this.config.dims.width + ",0)");
  }

  refreshAxisRight() {
    if (!this.config.showRightAxis) {
      return;
    }
    this.svg
      .selectAll(
        "g.y.axis.portfolio-axis.right." + this.config.internalClassName
      )
      .call(this.yAxisRight);
  }

  draw() {
    if (this.config.hide) {
      return;
    }
    super.draw();

    this.yPercentScale = d3.scaleLinear().range([this.config.dims.height, 0]);
    this.yAxis = d3.axisLeft(this.yScale).tickFormat(d => { return d3.format("+.0%")(d); });
    applyTicks(this.yAxis, this.config.leftAxisTicks);

    this.close = techan.plot.close().xScale(this.xScale).yScale(this.yScale);
    this.portfolio = techan.plot
      .close()
      .xScale(this.xScale)
      .yScale(this.yScale);
    this.adjClose = techan.plot.close().xScale(this.xScale).yScale(this.yScale);

    if (!this.config.hideXAxis) {
      this.xAxis = d3.axisBottom(this.xScale);
      applyTicks(this.xAxis, this.config.bottomAxisTicks);
    }

    this.portfolioData = this.data.portfolio.map((d) => {
      return {
        date: d.date,
        open: +d.value,
        high: +d.value,
        low: +d.value,
        close: +d.value,
        volume: 0,
      };
    });

    this.closeData = this.data.close;

    this.adjCloseData = this.data.adjClose.map((d) => {
      return {
        date: d.date,
        open: +d.value,
        high: +d.value,
        low: +d.value,
        close: +d.value,
        volume: 0,
      };
    });


    const scale = (data: DataOhlc): DataOhlc => {
      const origin = data[0].close;
      // const max = Math.max(...data.map(d => d.close));
      // const min = Math.min(...data.map(d => d.close));
      let factor: (x: number) => number;
      if (origin == 0) {
        const max = Math.max(...data.map(d => d.close));
        if (max == 0) {
          factor = x => x;
        }
        else {
          factor = x => ((x - origin) / max);
        }
      } else {
        // if (max / origin > 100) {
        //   if (origin / min > max / origin) {
        //     factor = x => ((min - origin) / (-100) * (x - origin) + min)
        //   } else {
        //     factor = x => ((max - origin) / (100) * (x - origin) + max)
        //   }
        // }

        // else {
        factor = x => ((x - origin) / origin);
        // }
      }


      let d = data.map(d => {
        return {
          date: d.date,
          open: factor(+d.open),
          high: factor(+d.high),
          low: factor(+d.low),
          close: factor(+d.close),
          volume: +d.volume
        }
      })
      return d;
    }

    this.scaledAdjCloseData = scale(this.adjCloseData);
    this.scaledCloseData = scale(this.closeData);
    this.scaledPortfolioData = scale(this.portfolioData);
    //console.log(this.closeData, this.scaledCloseData);
    this.portfolioData = this.scaledPortfolioData;
    this.closeData = this.scaledCloseData;
    this.adjCloseData = this.scaledAdjCloseData;


    //rescale the 3 datas as we want the same origin:



    // .sort((a, b) => {
    //   return d3.ascending(
    //     this.close.accessor().d(a),
    //     this.close.accessor().d(b)
    //   );
    // });



    this.chartSvg = this.svg
      .append("g")
      .attr("class", "portfolio " + this.config.internalClassName)
      .attr("transform", "translate(0," + this.config.dims.margin.top + ")");

    this.chartSvg
      .append("g")
      .attr("class", "zero-chart " + this.config.internalClassName)
      .attr("stroke-dasharray", "4");




    this.chartSvg
      .append("g")
      .attr("class", "adj-close-chart " + this.config.internalClassName);

    this.chartSvg
      .append("g")
      .attr("class", "close-chart " + this.config.internalClassName);



    this.chartSvg
      .append("g")
      .attr("class", "portfolio-chart " + this.config.internalClassName)
      .attr("opacity", "0.7");




    this.chartSvg
      .append("g")
      .attr(
        "class",
        "x axis bottom portfolio-axis " + this.config.internalClassName
      )
      .attr("transform", "translate(0," + this.config.dims.height + ")");

    this.chartSvg
      .append("g")
      .attr(
        "class",
        "y axis left portfolio-axis " + this.config.internalClassName
      )
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(this.config.yLabel || "Change");
    this.drawAxisRight();

    this.chartSvg
      .append("g")
      .attr("class", "pane " + this.config.internalClassName);

    const brushed = (target, type, selection, sourceEvent, mode) => {
      if (this.chartsProvider.brushed && this.chartsProvider.config.minimumBrushSize) {
        if (this.chartsProvider.getBrushSize().tradingDays < this.chartsProvider.config.minimumBrushSize) {
          this.chartsProvider.brushCallbacks.forEach(cb => cb(false, target, type, selection, sourceEvent, mode));
          this.chartsProvider.clearBrush()
          return;
        }
      }

      if (this.chartsProvider.brushed && this.chartsProvider.brushCallbacks.length > 0) {
        this.chartsProvider.brushCallbacks.forEach(cb => cb(true, target, type, selection, sourceEvent, mode));
      }


      const refZoomable = this.xScale.zoomable();
      if (!(this.chartsProvider.config.overrideBrushNumDays || this.chartsProvider.config.overrideBrushNumDays === 0)) {
      // if (!this.chartsProvider.config.applyBrushManually) {
      this.config.brushTargets.forEach(({ scale, update, chart }) => {
        const zoomable = scale.zoomable();

        zoomable.domain(refZoomable.domain());

        if (d3.event.selection !== null) {
          let range = d3.event.selection;
          let domain = range.map(zoomable.invert);
          domain = domain.map(Math.round);
          // if(!chart.isIndicator()){
          //   domain[0]+=11;
          //   domain[1]+=11;
          // }
          zoomable.domain(domain);
        }
        update();
      });
      }
      // }
    };

    this.brush = d3
      .brushX()
      .extent([
        [0, 0],
        [this.config.dims.width, this.config.dims.height],
      ])
      .on("end", brushed)
      ;

    if (d3.select(".dynamic-label-portfolio").empty()) {
      d3
        .select("body")
        .append("div")
        .attr("class", "dynamic-label-portfolio")
        .style("opacity", 0);
    }
    this.update();
  }

  postupdate(): void {
    super.postupdate();
  }

  update() {
    super.update();

    this.xScale.domain(this.closeData.map(this.portfolio.accessor().d));
    let extents = [];
    if (this.config.showClose) {
      extents.push(techan.scale.plot
        .ohlc(this.closeData, this.close.accessor())
        .domain());
    }
    if (this.config.showPortfolio) {
      extents.push(techan.scale.plot
        .ohlc(this.portfolioData, this.portfolio.accessor())
        .domain())
    }
    if (this.config.showAdjClose) {
      extents.push(techan.scale.plot
        .ohlc(this.adjCloseData, this.adjClose.accessor())
        .domain())
    }
    this.yScale.domain(
      d3.extent(
        Array.prototype.concat(
          ...extents
        )
      )
    );
    this.yPercentScale.domain(
      techan.scale.plot
        .percent(this.yScale, this.closeData[0].close)
        .domain()
    );



    this.chartSvg
      .select("g.pane")
      .call(this.brush)
      .selectAll("rect")
      .attr("height", this.config.dims.height);



    if (this.config.showZeroLine) {
      this.svg.selectAll("g.zero-chart." + this.config.internalClassName)
        .datum(this.adjCloseData.map(x => ({ ...x, close: this.adjCloseData[0].close })))
        .call(this.adjClose);
    }

    if (this.config.showPortfolio !== false) {
      this.portfolio = techan.plot
        .close()
        .xScale(this.xScale)
        .yScale(this.yScale);
      this.svg
        .selectAll("g.portfolio-chart." + this.config.internalClassName)
        .datum(this.portfolioData)
        .call(this.portfolio);
    }

    if (this.config.showAdjClose !== false) {
      this.adjClose = techan.plot.close().xScale(this.xScale).yScale(this.yScale);
      this.svg
        .selectAll("g.adj-close-chart." + this.config.internalClassName)
        .datum(this.adjCloseData)
        .call(this.adjClose);
    }

    if (this.config.showClose !== false) {
      this.svg
        .selectAll("g.close-chart." + this.config.internalClassName)
        .datum(this.closeData)
        .call(this.close);
    }



    this.svg
      .selectAll("g.x.axis.bottom." + this.config.internalClassName)
      .call(this.xAxis);

    this.svg
      .selectAll("g.y.axis.left." + this.config.internalClassName)
      .call(this.yAxis);

    this.refreshAxisRight();

    //dynamic label
    // const labelDiv = d3
    //   .select("body")
    //   .append("div")
    //   .attr("class", "dynamic-label-portfolio")
    //   .style("opacity", 0);

    const labelDiv = d3
      .select(".dynamic-label-portfolio")
      .style("opacity", 0);

    const showTooltip = (text: string) => {
      return function () {
        this.classList.add("highlighted");
        labelDiv.transition().duration(200).style("opacity", 0.9);
        labelDiv
          .html(text)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      };
    };
    const hideTooltip = () => {
      return function () {
        this.classList.remove("highlighted");
        labelDiv.transition().duration(500).style("opacity", 0);
      };
    };

    const addTooltip = (selector: string, text: string) => {
      //console.log(text);
      this.chartSvg.select(selector).raise();
      this.chartSvg
        .select(selector + " path.line")
        .on("mouseover", showTooltip(text))
        .on("mouseout", hideTooltip());
    };

    addTooltip(".portfolio-chart", this.config.portfolioTooltip || "Portfolio");
    addTooltip(".adj-close-chart", this.config.adjCloseTooltip || "Adj. Close");
    addTooltip(".close-chart", this.config.closeTooltip || "Close");

    this.postupdate();
  }
}

class Indicator extends Chart {
  name: string;
  data: DataOhlc;
  accessor: any;
  indicator: any;
  indicatorSvg: any;
  indicatorData: any;
  chartSvg: any;
  yAxisRight: d3.Axis<number>;
  period: number = 0;
  constructor(public config: IndicatorConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
    this.name = this.constructor.name.toLowerCase();
  }
  public isIndicator(): boolean {
    return true;
  }

  public getData(d: Date): any {
    super.getData(d);
    return this.indicatorData.find((x) => {
      let d2 = x.date;
      return d.toLocaleDateString("en-US") == d2.toLocaleDateString("en-US");
    });
  }

  drawAxisRight() {
    if (!this.config.hideRightAxis) {
      this.yAxisRight = d3.axisRight(this.yScale);
      this.yAxisRight.tickFormat(billionsFormatter()); //.tickFormat(d3.format(",.1f")).tickPadding([-20]);
      applyTicks(this.yAxisRight, this.config.rightAxisTicks);
      this.chartSvg
        .append("g")
        .attr(
          "class",
          "y axis right indicator-axis " + this.config.internalClassName
        )
        .attr("transform", "translate(" + this.config.dims.width + ",0)");
      // .append("text")
      // .attr("transform", "translate(28," + this.config.dims.margin.top + ")")
      // .attr("y", 6)
      // .attr("dy", "-2.1em")
      // .style("text-anchor", "end")
      // .text(
      //   this.config.rightAxisLabel ||
      //     this.name.charAt(0).toUpperCase() + this.name.slice(1)
      // );
    }
  }

  refreshAxisRight() {
    if (this.config.hideRightAxis) {
      return;
    }
    this.svg
      .selectAll(
        "g.y.axis.right.indicator-axis." + this.config.internalClassName
      )
      .call(this.yAxisRight);
  }

  getIndicatorData(): any {
    return techan.indicator[this.name]()(this.data);
  }

  draw() {
    if (this.config.hide) {
      return;
    }
    super.draw();
    this.indicator = techan.plot[this.name]()
      .xScale(this.xScale)
      .yScale(this.yScale);

    // if(this.name=="rsi"){
    //   this.indicator.overbought(90);
    // }

    if (!this.config.hideXAxis) {
      this.xAxis = d3.axisBottom(this.xScale);
      applyTicks(this.xAxis, this.config.bottomAxisTicks);
    }
    //formatting function reference: http://bl.ocks.org/zanarmstrong/05c1e95bf7aa16c4768e   https://github.com/d3/d3-format
    this.yAxis = d3.axisLeft(this.yScale);
    this.yAxis.tickFormat(billionsFormatter());

    this.accessor = this.indicator.accessor();
    // this.data = this.data.sort((a, b) =>
    //   d3.ascending(this.accessor.d(a), this.accessor.d(b))
    // );

    this.svg
      .append("clipPath")
      .attr("id", "clip-indicator-" + this.config.internalClassName)
      .append("rect")
      .attr("x", 0)
      .attr("y", this.yScale(1))
      .attr("width", this.config.dims.width)
      .attr("height", this.yScale(0) - this.yScale(1));

    this.chartSvg = this.svg
      .append("g")
      .attr("class", "chart " + this.config.internalClassName)
      .attr("transform", "translate(0," + this.config.dims.margin.top + ")");

    this.indicatorSvg = this.chartSvg
      .append("g")
      .attr("class", this.name + " " + this.config.internalClassName)
      .attr(
        "clip-path",
        "url(#clip-indicator-" + this.config.internalClassName + ")"
      );

    if (!this.config.hideXAxis) {
      this.chartSvg
        .append("g")
        .attr("class", "x axis hide-years " + this.config.internalClassName)
        .attr("transform", "translate(0," + this.config.dims.height + ")");
    }
    this.chartSvg
      .append("g")
      .attr(
        "class",
        "y axis left indicator-axis " + this.config.internalClassName
      )
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("x", -7)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(
        this.config.yLabel ||
        this.name.charAt(0).toUpperCase() + this.name.slice(1)
      );

    this.drawAxisRight();

    const ohlcAnnotation = techan.plot
      .axisannotation()
      .axis(this.yAxis)
      .orient("left")
      .format(d3.format(",.2f"));

    const timeAnnotation = techan.plot
      .axisannotation()
      .axis(this.xAxis)
      .orient("bottom")
      .format(yearsFormatter(this.baseYear, this.config.hideYears))
      .width(65)
      .translate([0, this.config.dims.height]);

    const crosshair = techan.plot
      .crosshair()
      .xScale(this.xScale)
      .yScale(this.yScale)
      .xAnnotation(timeAnnotation)
      .yAnnotation(ohlcAnnotation);

    this.chartSvg.append("g").attr("class", "crosshair").call(crosshair);
    this.indicatorData = this.getIndicatorData();

    //this.xScale.domain(this.indicatorData.map(this.indicator.accessor().d));
    //using the strategy where we show the indicator in the preroll portion as well. We do not cut it off. There's just no data for those dates. If preroll cut off is needed use something like the above commented out line and calculate which indicator amongst the ones enabled has the greatest period. Then slice that much data from all the charts including the other indicators. But for the other indicators you also have to consider their own preroll. So accordingly reduce the slice. Check out candlestick.drawScales or search for "14".
    this.xScale.domain(this.data.map((x) => x.date));
    this.svg
      .selectAll("g." + this.name + "." + this.config.internalClassName)
      .datum(this.indicatorData)
      .call(this.indicator);
    this.update();
  }

  update() {
    super.update();
    // if (this.period) {
    //   this.indicatorData = techan.indicator[this.name]().period(this.period)(
    //     this.data
    //   );
    // } else {
    //   this.indicatorData = techan.indicator[this.name]()(this.data);
    // }

    const brushedData = Array.prototype.slice.apply(
      this.indicatorData,
      this.xScale.zoomable().domain()
    );
    if (this.name == "heikinashi") {
      this.yScale.domain(
        techan.scale.plot.ohlc(brushedData, this.indicator.accessor()).domain()
      );
    } else {
      this.yScale.domain(techan.scale.plot[this.name](this.indicatorData).domain());
    }

    //NOTE: there's an optimisation here - commenting out the datum call and calling this.indicator.refresh instead of this.indicator. This is because we know that the data does not change. If it does change, then undo this. Also uncomment the lines at the top of this function refreshing the indicatorData.
    this.svg
      .selectAll("g." + this.name + "." + this.config.internalClassName)
      // .datum(this.indicatorData)
      .call(this.indicator.refresh);

    if (!this.config.hideXAxis) {
      this.svg
        .selectAll("g.x.axis." + this.config.internalClassName)
        .call(this.xAxis);
    }
    this.svg
      .selectAll("g.y.axis.left." + this.config.internalClassName)
      .call(this.yAxis);
    this.refreshAxisRight();
    super.postupdate();
  }
}

class PeriodicIndicator extends Indicator {
  constructor(public config: PeriodicIndicatorConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
    if (this.config.period) {
      this.period = this.config.period;
    }
  }

  getIndicatorData() {
    if (this.period) {
      return techan.indicator[this.name]().period(this.period)(this.data);
    } else {
      return super.getIndicatorData();
    }
  }
}

class Atr extends PeriodicIndicator { }
class Adx extends PeriodicIndicator { }
class Aroon extends PeriodicIndicator {
  constructor(public config: AroonConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
  }
  getIndicatorData() {
    let ind = techan.indicator[this.name]();
    if (this.config.overbought) {
      ind.overbought(this.config.overbought);
    }
    if (this.config.middle) {
      ind.middle(this.config.middle);
    }
    if (this.config.oversold) {
      ind.oversold(this.config.oversold);
    }
    return ind(this.data);
  }
}
class AtrTrailingStop extends PeriodicIndicator {
  constructor(public config: AtrTrailingStopConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
  }
  getIndicatorData() {
    let ind = techan.indicator[this.name]();
    if (this.config.multiplier) {
      ind.multiplier(this.config.multiplier);
    }
    return ind(this.data);
  }
}

class Heikinashi extends Indicator { }
class Ichimoku extends Indicator {
  constructor(public config: IchimokuConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
  }
  getIndicatorData() {
    let ind = techan.indicator[this.name]();
    if (this.config.senkouSpanB) {
      ind.senkouSpanB(this.config.senkouSpanB);
    }
    if (this.config.tenkanSen) {
      ind.tenkanSen(this.config.tenkanSen);
    }
    if (this.config.kijunSen) {
      ind.kijunSen(this.config.kijunSen);
    }
    return ind(this.data);
  }
}
class Macd extends Indicator {
  constructor(public config: MacdConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
  }
  getIndicatorData() {
    let ind = techan.indicator[this.name]();
    if (this.config.fast) {
      ind.fast(this.config.fast);
    }
    if (this.config.signal) {
      ind.signal(this.config.signal);
    }
    if (this.config.slow) {
      ind.slow(this.config.slow);
    }
    return ind(this.data);
  }
}
class Rsi extends PeriodicIndicator {
  constructor(public config: RsiConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
  }
  getIndicatorData() {
    let ind = techan.indicator[this.name]();
    if (this.config.overbought) {
      ind.overbought(this.config.overbought);
    }
    if (this.config.middle) {
      ind.middle(this.config.middle);
    }
    if (this.config.oversold) {
      ind.oversold(this.config.oversold);
    }
    return ind(this.data);
  }
}
class Stochastic extends PeriodicIndicator {
  constructor(public config: StochasticConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
  }
  getIndicatorData() {
    let ind = techan.indicator[this.name]();
    if (this.config.overbought) {
      ind.overbought(this.config.overbought);
    }
    if (this.config.periodD) {
      ind.periodD(this.config.periodD);
    }
    if (this.config.oversold) {
      ind.oversold(this.config.oversold);
    }
    return ind(this.data);
  }
}
class Williams extends PeriodicIndicator {
  constructor(public config: WilliamsConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
  }
  getIndicatorData() {
    let ind = techan.indicator[this.name]();
    if (this.config.overbought) {
      ind.overbought(this.config.overbought);
    }
    if (this.config.middle) {
      ind.middle(this.config.middle);
    }
    if (this.config.oversold) {
      ind.oversold(this.config.oversold);
    }
    return ind(this.data);
  }
}
class Bollinger extends PeriodicIndicator {
  constructor(public config: BollingerConfig, public chartsProvider: ChartsProvider) {
    super(config, chartsProvider);
  }
  getIndicatorData() {
    let ind = techan.indicator[this.name]();
    if (this.config.sdMultiplication) {
      ind.sdMultiplication(this.config.sdMultiplication);
    }
    return ind(this.data);
  }
}
class Sroc extends PeriodicIndicator { }
class Vwap extends PeriodicIndicator { }

const chartMap: { [type: string]: typeof Chart } = {
  candlestick: Candlestick,
  ohlc: Ohlc,
  portfolio: Portfolio,
  atr: Atr,
  adx: Adx,
  aroon: Aroon,
  atrtrailingstop: AtrTrailingStop,
  heikinashi: Heikinashi,
  ichimoku: Ichimoku,
  macd: Macd,
  rsi: Rsi,
  stochastic: Stochastic,
  williams: Williams,
  bollinger: Bollinger,
  sroc: Sroc,
  vwap: Vwap,
};

function applyTicks(axis: d3.Axis<any>, ticks: number) {
  if (ticks) {
    axis.ticks(ticks);
  }
}

const billionsFormatter = (format: string = ",.3s") => {
  return (d) => {
    let res = d3.format(format)(d);
    res = res.replace("G", "B").replace("P", "000T");
    return res;
  };
};

const yearsFormatter = (baseYear: string | number, hideYears: boolean) => {
  return (d) => {
    let res = d3.timeFormat("%Y-%m-%d")(d);
    if (!hideYears) {
      return res;
    }
    let parts = res.split("-");
    let year = parts[0];
    let yrNo = +year - +baseYear + 1;
    return `${parts[1]}-${parts[2]}, Yr ${yrNo}`;
  };
};

function filterByDate(data: any, date: Date, parentKey?: string, out?: any) {
  if (!out) {
    out = {};
  }
  if (typeof data === "object" && !Array.isArray(data) && data !== null) {
    for (let k in data) {
      if (parentKey) {
        out[parentKey] = {};
      }
      filterByDate(data[k], date, k, out[parentKey] || out);
    }
  } else {
    if (Array.isArray(data)) {
      if ("date" in data[0]) {
        let filteredData = data.find((z) => {
          let d2 = z.date;
          return (
            date.toLocaleDateString("en-US") == d2.toLocaleDateString("en-US")
          );
        });
        //delete filteredData.date;

        out[parentKey] = cloneDeep(filteredData);
        delete out[parentKey].date;
      }
    }
  }
  return out;
}
