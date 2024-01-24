var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
//import { brush } from "d3-brush";
//import * as d3 from "d3";
import * as cloneDeep from "lodash.clonedeep";
import { sanitizeLeadingIndicator } from "../../constants";
import { Supstance } from "../supstance/supstance";
import * as throttle from 'lodash.throttle';
var chartTypes = [
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
var ChartsProvider = /** @class */ (function () {
    function ChartsProvider() {
        this.brushCallbacks = [];
        this.renderCallbacks = [];
        this.renderThrottled = throttle(this.render.bind(this), 500);
        this.charts = {};
        window["cp"] = this;
    }
    ChartsProvider.prototype.getData = function (chartType, date) {
        if (chartType in this.charts) {
            return this.charts[chartType].getData(date);
        }
    };
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
      
    */
    ChartsProvider.prototype.calculateData = function (indicatorName, d, indicatorConfig, data) {
        if (!data) {
            data = this.charts["portfolio"].data["close"];
        }
        var indicator = techan.indicator[indicatorName]();
        if (typeof indicatorConfig === "object" &&
            !Array.isArray(indicatorConfig) &&
            !(indicatorConfig === null)) {
            for (var key in indicatorConfig) {
                var value = indicatorConfig[key];
                indicator[key](value);
            }
        }
        var outData = indicator(data);
        var answer;
        for (var i = 0; i < outData.length; i++) {
            var x = outData[i];
            var d2 = x.date;
            d.setHours(0, 0, 0, 0);
            d2.setHours(0, 0, 0, 0);
            if (d.getTime() == d2.getTime()) {
                answer = cloneDeep(x);
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
        if (answer && typeof answer === "object") {
            delete answer.date;
        }
        return answer;
    };
    ChartsProvider.prototype.onBrush = function (callback) {
        this.brushCallbacks.push(callback);
    };
    ChartsProvider.prototype.offBrush = function (callback) {
        this.brushCallbacks = this.brushCallbacks.filter(function (cb) { return cb != callback; });
    };
    ChartsProvider.prototype.brushScaleMap = function (startDate, endDate) {
        if (!this.config.brush || !this.charts[this.config.brush]) {
            return;
        }
        var chart = this.charts[this.config.brush];
        var startW = chart.xScale(startDate);
        var endW = chart.xScale(endDate);
        return { startW: startW, endW: endW };
    };
    ChartsProvider.prototype.brushScaleMapReverse = function (startW, endW) {
        if (!this.config.brush || !this.charts[this.config.brush]) {
            return;
        }
        var chart = this.charts[this.config.brush];
        var startDate = chart.xScale.invert(startW);
        var endDate = chart.xScale.invert(endW);
        return { startDate: startDate, endDate: endDate };
    };
    ChartsProvider.prototype.setBrush = function (startDate, endDate) {
        if (!this.config.brush || !this.charts[this.config.brush]) {
            return;
        }
        var brushChart = this.charts[this.config.brush];
        var domain = brushChart.xScale.domain();
        if (startDate.getTime() < domain[0].getTime()) {
            startDate = new Date(domain[0]);
        }
        if (startDate.getTime() > domain[domain.length - 1].getTime()) {
            startDate = new Date(domain[domain.length - 1]);
        }
        if (endDate.getTime() < domain[0].getTime()) {
            endDate = new Date(domain[0]);
        }
        if (endDate.getTime() > domain[domain.length - 1].getTime()) {
            endDate = new Date(domain[domain.length - 1]);
        }
        var _a = this.brushScaleMap(startDate, endDate), startW = _a.startW, endW = _a.endW;
        var chartSvg = brushChart.chartSvg;
        if (!chartSvg.select("g.pane")) {
            return;
        }
        brushChart.brush.move(chartSvg.select("g.pane"), [startW, endW]);
    };
    ChartsProvider.prototype.setBrushDims = function (startW, endW) {
        if (!this.config.brush || !this.charts[this.config.brush]) {
            return;
        }
        var brushChart = this.charts[this.config.brush];
        if (!brushChart) {
            return;
        }
        var chartSvg = brushChart.chartSvg;
        var brushSelection = chartSvg.select("g.pane");
        startW = Math.max(0, startW);
        startW = Math.min(brushChart.config.dims.width, startW);
        endW = Math.max(0, endW);
        endW = Math.min(brushChart.config.dims.width, endW);
        if (brushSelection) {
            brushChart.brush.move(chartSvg.select("g.pane"), [startW, endW]);
        }
    };
    ChartsProvider.prototype.clearBrush = function () {
        if (!this.config.brush || !this.charts[this.config.brush]) {
            return;
        }
        if (!this.brushed) {
            return;
        }
        var brushChart = this.charts[this.config.brush];
        var chartSvg = brushChart.chartSvg;
        if (!chartSvg.select("g.pane")) {
            return;
        }
        brushChart.brush.move(chartSvg.select("g.pane"), null);
    };
    ChartsProvider.prototype.getCurrentBrush = function () {
        if (!this.config.brush || !this.charts[this.config.brush]) {
            return null;
        }
        if (!this.brushed) {
            return null;
        }
        var brushNode = document.querySelector("g.pane");
        if (!brushNode) {
            return null;
        }
        var selection = d3.brushSelection(brushNode);
        if (!Array.isArray(selection)) {
            return null;
        }
        if (selection.length != 2) {
            return null;
        }
        var startW = selection[0], endW = selection[1];
        //TODO fix bug when move to end is called the end date is null, similarlu at starting from 0 the start date could be null
        var _a = this.brushScaleMapReverse(startW, endW), startDate = _a.startDate, endDate = _a.endDate;
        if (endDate === null) {
            //this happens whne the selection is right at the right edge, in this case the end date is undefined as it is beyind the last date
            //find last date and set endDate to that...
            var brushChart = this.charts[this.config.brush];
            var domain = brushChart.xScale.domain();
            endDate = domain[domain.length - 1];
        }
        if (startDate == null) {
            //similar situation at the left edge
            var brushChart = this.charts[this.config.brush];
            var domain = brushChart.xScale.domain();
            startDate = domain[0];
        }
        return { startDate: startDate, endDate: endDate };
    };
    ChartsProvider.prototype.getCurrentBrushDims = function () {
        if (!this.config.brush || !this.charts[this.config.brush]) {
            return null;
        }
        if (!this.brushed) {
            return null;
        }
        var brushNode = document.querySelector("g.pane");
        if (!brushNode) {
            return null;
        }
        var _a = d3.brushSelection(brushNode), startW = _a[0], endW = _a[1];
        return { startW: startW, endW: endW };
    };
    //the actualDays boolean if set to true will slide the brush by the actual days instead of trading days which is the default.
    ChartsProvider.prototype.slideBrush = function (days, actualDays) {
        if (!this.config.brush || !this.charts[this.config.brush]) {
            return;
        }
        if (!this.brushed) {
            return;
        }
        var currentSelection = this.getCurrentBrush();
        if (!currentSelection)
            return;
        var startDate = currentSelection.startDate, endDate = currentSelection.endDate;
        var brushChart = this.charts[this.config.brush];
        //calculate the new start date and end date
        var newStartDate, newEndDate;
        if (actualDays) {
            newStartDate = new Date(startDate);
            newStartDate.setDate(newStartDate.getDate() + days);
            newEndDate = new Date(endDate);
            newEndDate.setDate(newEndDate.getDate() + days);
            this.setBrush(newStartDate, newEndDate);
        }
        else {
            //get width of a single day
            var origin_1 = brushChart.xScale(startDate);
            var newDate = new Date(startDate);
            var end = brushChart.xScale(newDate);
            while (end == origin_1) {
                newDate.setDate(newDate.getDate() + 1);
                end = brushChart.xScale(newDate);
            }
            //width of a single day
            var w = end - origin_1;
            var _a = this.getCurrentBrushDims(), startW = _a.startW, endW = _a.endW;
            var newStartW = startW + days * w;
            var newEndW = endW + days * w;
            this.setBrushDims(newStartW, newEndW);
        }
    };
    ChartsProvider.prototype.slideBrushRight = function (days, actualDays) {
        return this.slideBrush(days, actualDays);
    };
    ChartsProvider.prototype.slideBrushLeft = function (days, actualDays) {
        return this.slideBrush(-1 * days, actualDays);
    };
    Object.defineProperty(ChartsProvider.prototype, "brushed", {
        get: function () {
            if (!this.config || !this.config.brush || !this.charts[this.config.brush]) {
                return false;
            }
            var brushNode = document.querySelector("g.pane");
            if (!brushNode) {
                return false;
            }
            var selection = d3.brushSelection(brushNode);
            if (!selection || !Array.isArray(selection) || !(selection.length == 2)) {
                return false;
            }
            return true;
        },
        enumerable: false,
        configurable: true
    });
    ChartsProvider.prototype.moveBrushToEnd = function () {
        if (!this.config.brush || !this.charts[this.config.brush]) {
            return;
        }
        if (!this.brushed) {
            return;
        }
        var brushChart = this.charts[this.config.brush];
        var _a = this.getCurrentBrushDims(), startW = _a.startW, endW = _a.endW;
        var width = endW - startW;
        var newEndW = brushChart.config.dims.width;
        var newStartW = newEndW - width;
        this.setBrushDims(newStartW, newEndW);
    };
    ChartsProvider.prototype.getBrushSize = function () {
        if (!this.brushed) {
            return {
                tradingDays: 0, actualDays: 0, width: 0, percentage: 0
            };
        }
        var _a = this.getCurrentBrush(), startDate = _a.startDate, endDate = _a.endDate;
        var _b = this.getCurrentBrushDims(), startW = _b.startW, endW = _b.endW;
        var brushChart = this.charts[this.config.brush];
        //get width of a single day
        var origin = brushChart.xScale(startDate);
        var newDate = new Date(startDate);
        var end = brushChart.xScale(newDate);
        while (end == origin) {
            newDate.setDate(newDate.getDate() + 1);
            end = brushChart.xScale(newDate);
        }
        //width of a single day
        var w = end - origin;
        var width = endW - startW;
        var tradingDays = width / w;
        var actualDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        var percentage = width / brushChart.config.dims.width * 100;
        return { tradingDays: tradingDays, actualDays: actualDays, width: width, percentage: percentage };
    };
    ChartsProvider.prototype.onRender = function (cb) {
        this.renderCallbacks.push(cb);
    };
    ChartsProvider.prototype.offRender = function (fn) {
        this.renderCallbacks = this.renderCallbacks.filter(function (cb) { return cb != fn; });
    };
    ChartsProvider.prototype.onRenderOnce = function (fn) {
        var _this = this;
        var cb = function () {
            fn();
            _this.offRender(cb);
        };
        this.onRender(cb);
    };
    ChartsProvider.prototype.clearRenderCallbacks = function () {
        this.renderCallbacks = [];
    };
    ChartsProvider.prototype.render = function (el, config) {
        var _this = this;
        this.config = config;
        config = cloneDeep(config);
        //clear up el
        // HELP
        //console.error('null?');
        document.querySelector(el).innerHTML = "";
        d3.selectAll("#d3el svg > *").remove();
        //set default dims
        if (!config.dims.height) {
            config.dims.height = 0;
            chartTypes.forEach(function (type) {
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
            .attr("width", config.dims.width + config.dims.margin.left + config.dims.margin.right)
            .attr("height", config.dims.height + config.dims.margin.top + config.dims.margin.bottom)
            .append("g")
            .attr("transform", "translate(" +
            config.dims.margin.left +
            "," +
            config.dims.margin.top +
            ")");
        //iterate through sequence, make each chart and render it.
        var heightSoFar = 0;
        var brushTargets = [];
        config.sequence.forEach(function (chartType) {
            if (config[chartType].hide) {
                return;
            }
            var chartConfig = config[chartType];
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
                }
                else {
                    if (config.data) {
                        chartConfig.baseYear = +new Date(config.data[0].date).getFullYear();
                    }
                    else {
                        chartConfig.baseYear = +new Date(chartConfig.data[0].date).getFullYear();
                    }
                }
            }
            chartConfig.parentSvg = config.svg;
            chartConfig.parentDims = config.dims;
            if (config.brush == chartType) {
                //this chart will be a brush chart
                chartConfig._brush = true;
                chartConfig.brushTargets = brushTargets;
            }
            else {
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
            var chart = new chartMap[chartType](chartConfig, _this);
            _this.charts[chartType] = chart;
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
        this.renderCallbacks.forEach(function (cb) { return cb(); });
    };
    ChartsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], ChartsProvider);
    return ChartsProvider;
}());
export { ChartsProvider };
var Chart = /** @class */ (function () {
    function Chart(config, chartsProvider) {
        this.config = config;
        this.chartsProvider = chartsProvider;
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
    Chart.prototype.getData = function (d) { };
    Chart.prototype.isIndicator = function () {
        return false;
    };
    Chart.prototype.render = function () {
        if (!this.config.hide) {
            this.draw();
            this.hideYears();
        }
    };
    Chart.prototype.hideYears = function () {
        if (this.config.hideYears) {
            var re_1 = new RegExp("^\\s*((19|20)[0-9][0-9])\\s*$");
            var re2_1 = new RegExp("^...\\s((19|20)[0-9][0-9])\\s*$");
            var firstYear_1 = this.baseYear;
            Array.from(document.querySelectorAll("." + this.config.internalClassName + ".x, .hide-years")).forEach(function (el) {
                Array.from(el.querySelectorAll("text")).forEach(function (el, i) {
                    if (re_1.test(el.innerHTML)) {
                        var year = +el.innerHTML.replace(re_1, "$1") - firstYear_1 + 1;
                        el.innerHTML = "Yr " + year;
                    }
                    if (re2_1.test(el.innerHTML)) {
                        var year = +el.innerHTML.replace(re2_1, "$1") - firstYear_1 + 1;
                        el.innerHTML =
                            el.innerHTML.replace(/(.*)\s((19|20)[0-9][0-9])(.*)/g, "$1") +
                                ", Yr " +
                                year;
                    }
                });
            });
        }
    };
    Chart.prototype.drawCrosshair = function () {
        if (!this.config.crossHair) {
            return;
        }
        this.crosshair = techan.plot
            .crosshair()
            .xScale(this.xScale)
            .yScale(this.yScale);
        var ohlcAnnotation = techan.plot
            .axisannotation()
            .axis(this.yAxis)
            .orient("left")
            .format(d3.format(",.2f"));
        var timeAnnotation = techan.plot
            .axisannotation()
            .axis(this.xAxis)
            .orient("bottom")
            .format(yearsFormatter(this.baseYear, this.config.hideYears))
            .width(65)
            .translate([0, this.config.dims.height]);
        this.crosshair.xAnnotation(timeAnnotation).yAnnotation(ohlcAnnotation);
        this.svg.append("g").attr("class", "crosshair").call(this.crosshair);
    };
    Chart.prototype.draw = function () {
        this.xScale = techan.scale.financetime().range([0, this.config.dims.width]);
        this.yScale = d3.scaleLinear().range([this.config.dims.height, 0]);
        this.yAxis = d3.axisLeft(this.yScale);
        applyTicks(this.yAxis, this.config.leftAxisTicks);
        this.svg = this.config.parentSvg;
    };
    Chart.prototype.update = function () {
        applyTicks(this.xAxis, this.config.bottomAxisTicks);
        applyTicks(this.yAxis, this.config.leftAxisTicks);
    };
    Chart.prototype.postupdate = function () {
        this.hideYears();
    };
    return Chart;
}());
var Candlestick = /** @class */ (function (_super) {
    __extends(Candlestick, _super);
    function Candlestick(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        _this.smas = [];
        _this.emas = [];
        _this.bollingers = [];
        _this.atrTrailingStops = [];
        _this.refreshLeadingIndicators = function () {
            var xScale = _this.xScale;
            ["DXY", "Unemployment", "Housing", "Yield", "SnP", "Industry", "VIX", "Recessions"].forEach(function (li) {
                if (_this.config[li]) {
                    var data = sanitizeLeadingIndicator(li);
                    if (li == "Recessions") {
                        //data = window["recessionData"] || data;
                        var g = _this.svg.select("g.recession-indicator");
                        g.selectAll("." + li)
                            .remove()
                            .exit()
                            .data(data)
                            .enter().append("rect")
                            .attr("class", "Recessions")
                            .attr("x", function (d) { return xScale(d.start); })
                            .attr("y", "-1000")
                            .attr("width", function (d) { return (xScale(d.end) - xScale(d.start)); })
                            .attr("height", "2000");
                        return;
                    }
                    var leadingScale_1 = _this.yScale.copy();
                    data = data.map(function (d) {
                        return {
                            date: d.date,
                            open: +d.value,
                            high: +d.value,
                            low: +d.value,
                            close: +d.value,
                            volume: 0,
                        };
                    });
                    _this[li] = techan.plot.close().xScale(_this.xScale).yScale(leadingScale_1);
                    leadingScale_1.domain(techan.scale.plot.ohlc(data, _this[li].accessor()).domain());
                    _this.svg
                        .append("g")
                        .attr("class", "indicator leading-indicator " + li + " " + _this.config.internalClassName)
                        .attr("clip-path", "url(#".concat(_this.clipURL, ")"));
                    _this.svg.selectAll("g.leading-indicator.".concat(li, ".").concat(_this.config.internalClassName)).datum(data).call(_this[li]);
                    var labelDiv_1 = d3
                        .select("body")
                        .append("div")
                        .attr("class", "dynamic-label-leading dynamic-label-" + li)
                        .style("opacity", 0);
                    var showTooltip_1 = function (text) {
                        return function (data) {
                            var dt = xScale.invert(d3.event.offsetX - 50);
                            //let val = data.find(x => +x.date == +dt)
                            //console.log(`val = ${val}`)
                            //if (!val) {
                            var val = leadingScale_1.invert(d3.event.offsetY - 10);
                            //}
                            var displayVal = Math.round(val * 100) / 100;
                            labelDiv_1.transition().duration(0).style("opacity", 0.9);
                            labelDiv_1
                                .html(displayVal)
                                .style("left", d3.event.pageX - 30 + "px")
                                .style("top", d3.event.pageY + 14 + "px");
                        };
                    };
                    var hideTooltip_1 = function () {
                        return function () {
                            labelDiv_1.transition().duration(2000).style("opacity", 0);
                        };
                    };
                    var addTooltip = function (selector, text) {
                        if (text === void 0) { text = ""; }
                        var selection = d3.selectAll(selector);
                        selection
                            .on("mouseover", showTooltip_1(text))
                            .on("mouseout", hideTooltip_1());
                    };
                    var removeTooltip = function (selector) {
                        var selection = d3.selectAll(selector);
                        selection
                            .on('mouseover', null)
                            .on("mouseout", null);
                    };
                    addTooltip("g.leading-indicator.".concat(li, ".").concat(_this.config.internalClassName), li);
                }
            });
        };
        _this.clipURL = "clip-candlestick" + _this.config.internalClassName;
        //hide indicator pre-roll to get the charts in sync
        //this.data = this.data.slice(33);
        _this.candlestickData = {
            ohlc: _this.data,
        };
        return _this;
    }
    Candlestick.prototype.getData = function (date) {
        _super.prototype.getData.call(this, date);
        return filterByDate(this.candlestickData, date);
    };
    Candlestick.prototype.drawLeadingIndicators = function () {
        var _this = this;
        ["DXY", "Unemployment", "Housing", "Yield", "SnP", "Industry", "VIX", "Recessions"].forEach(function (li) {
            if (_this.config[li]) {
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
                    var data_1 = sanitizeLeadingIndicator(li);
                    var g = _this.svg.append("g")
                        .attr("transform", "translate(0,0)")
                        .attr("clip-path", "url(#".concat(_this.clipURL, ")"))
                        .attr("class", "leading-indicator")
                        .attr("class", "indicator")
                        .attr("class", "recession-indicator");
                    var xScale_1 = _this.xScale;
                    g.selectAll("." + li)
                        .data(data_1)
                        .enter().append("rect")
                        .attr("class", "Recessions")
                        .attr("x", function (d) { return xScale_1(d.start); })
                        .attr("y", "-1000")
                        .attr("width", function (d) { return (xScale_1(d.end) - xScale_1(d.start)); })
                        .attr("height", "2000");
                    return;
                }
                var leadingScale = _this.yScale.copy();
                var data = sanitizeLeadingIndicator(li);
                data = data.map(function (d) {
                    return {
                        date: d.date,
                        open: +d.value,
                        high: +d.value,
                        low: +d.value,
                        close: +d.value,
                        volume: 0,
                    };
                });
                _this[li] = techan.plot.close().xScale(_this.xScale).yScale(leadingScale);
                leadingScale.domain(techan.scale.plot.ohlc(data, _this[li].accessor()).domain());
                _this.svg
                    .append("g")
                    .attr("class", "indicator leading-indicator " + li + " " + _this.config.internalClassName)
                    .attr("clip-path", "url(#".concat(_this.clipURL, ")"));
                _this.svg.selectAll("g.leading-indicator.".concat(li, ".").concat(_this.config.internalClassName)).datum(data).call(_this[li]);
            }
        });
    };
    Candlestick.prototype.drawSupstance = function () {
        if (!this.config.supstance || !this.config.supstance.show) {
            return;
        }
        var supData = this.calculateSupstanceData();
        this.svg
            .append("g")
            .attr("class", "indicator supstance-indicator " + this.config.internalClassName)
            .attr("clip-path", "url(#".concat(this.clipURL, ")"));
        var ohlcAnnotation = techan.plot.axisannotation()
            .axis(this.yAxis)
            .orient('right')
            .format(d3.format(',.1f'));
        var labelDiv = d3
            .select("body")
            .append("div")
            .attr("class", "dynamic-label-supstance")
            .style("opacity", 0);
        var showTooltip = function (text) {
            return function (_a) {
                var value = _a.value;
                var displayVal = text; // + " " + Math.round(value * 100) / 100
                labelDiv.transition().duration(0).style("opacity", 0.9);
                labelDiv
                    .html(displayVal)
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY - 28 + "px");
            };
        };
        var hideTooltip = function () {
            return function () {
                labelDiv.transition().duration(2000).style("opacity", 0);
            };
        };
        var addTooltip = function (selector, index, text) {
            if (index === void 0) { index = 0; }
            if (text === void 0) { text = ""; }
            var selection = d3.select(d3.selectAll(selector).filter(function (_, i) { return i == index; }).node().parentNode);
            selection
                .on("mouseover", showTooltip(text))
                .on("mouseout", hideTooltip());
        };
        var removeTooltip = function (selector, index) {
            if (index === void 0) { index = 0; }
            var selection = d3.select(d3.selectAll(selector).filter(function (_, i) { return i == index; }).node().parentNode);
            selection
                .on('mouseover', null)
                .on("mouseout", null);
        };
        this.supstance = techan.plot.supstance()
            .xScale(this.xScale)
            .yScale(this.yScale)
            .annotation([ohlcAnnotation]);
        //.on("mouseenter", showTooltip(""))
        //.on("mouseout", hideTooltip())
        //.on("drag", drag);
        this.svg.selectAll("g.supstance-indicator." + this.config.internalClassName).datum(supData).call(this.supstance);
        var paths = document.querySelectorAll(".supstance>path");
        var annots = document.querySelectorAll(".supstance~.axisannotation");
        var labels = this.config.supstance.labels;
        var _a = this.config.supstance, visibility = _a.visibility, color = _a.color, annotationVisibility = _a.annotationVisibility;
        [visibility, color, annotationVisibility].forEach(function (x) { if (!x) {
            x = [];
        } });
        if (visibility && Array.isArray(visibility)) {
            visibility.forEach(function (v, i) {
                if (paths[i]) {
                    paths[i].style.opacity = v ? "100%" : "0%";
                    if (v) {
                        addTooltip(".supstance", i, labels[i]);
                    }
                    else {
                        removeTooltip(".supstance", i);
                    }
                }
                if (annots[i]) {
                    annots[i].style.opacity = v && annotationVisibility[i] ? "100%" : "0%";
                }
            });
        }
        if (color && Array.isArray(color)) {
            color.forEach(function (c, i) {
                if (paths[i]) {
                    paths[i].style.stroke = c;
                }
            });
        }
    };
    Candlestick.prototype.refreshSupstance = function () {
        if (!this.config.supstance || !this.config.supstance.show) {
            return;
        }
        var supData = this.calculateSupstanceData();
        this.svg.selectAll("g.supstance-indicator." + this.config.internalClassName).datum(supData).call(this.supstance);
    };
    Candlestick.prototype.calculateSupstanceData = function () {
        var _this = this;
        var supData = Supstance.calculate(this.data, this.config.supstance.algorithmConfig);
        this.candlestickData.supstance = supData;
        var outData = [];
        supData.forEach(function (line) {
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
                        var dist = line[2] / 2;
                        var chartData = _this.config.data;
                        var targetIndex = chartData.findIndex(function (x) {
                            return (x.date.getTime() == line[1].getTime());
                        });
                        if (typeof targetIndex === "undefined") {
                            return;
                        }
                        var adjustIndex = function (index) {
                            var minIndex = 0;
                            var maxIndex = _this.config.data.length - 1;
                            return Math.max(Math.min(Math.round(index), maxIndex), minIndex);
                        };
                        var startIndex = adjustIndex(targetIndex - dist);
                        var endIndex = adjustIndex(targetIndex + dist);
                        outData.push({ value: line[0], start: _this.config.data[startIndex].date, end: _this.config.data[endIndex].date });
                    }
                    else {
                        // @ts-ignore
                        outData.push({ value: line[0], start: line[1], end: line[2] });
                    }
                }
            }
        });
        return outData;
    };
    Candlestick.prototype.drawBollinger = function () {
        var _this = this;
        if (!this.config.bollinger || this.config.bollinger.length == 0) {
            return;
        }
        this.candlestickData.bollinger = {};
        this.config.bollinger.forEach(function (period, i) {
            var bollingeri = techan.plot
                .bollinger()
                .xScale(_this.xScale)
                .yScale(_this.yScale);
            var indicator = techan.indicator.bollinger().period(period);
            if (_this.config.bollingerSdMultiplication) {
                indicator.sdMultiplication(_this.config.bollingerSdMultiplication);
            }
            _this.candlestickData.bollinger[period] = indicator(_this.data);
            _this.bollingers.push(bollingeri);
            _this.svg
                .append("g")
                .attr("class", "indicator bollinger boll-" + i + " " + _this.config.internalClassName)
                .attr("transform", "translate(0," + _this.config.dims.margin.top + ")")
                .attr("clip-path", "url(#".concat(_this.clipURL, ")"));
            _this.svg
                .select("g.bollinger.boll-" + i + "." + _this.config.internalClassName)
                .datum(_this.candlestickData.bollinger[period])
                .call(bollingeri);
        });
    };
    Candlestick.prototype.refreshBollinger = function () {
        var _this = this;
        if (!this.config.bollinger || this.config.bollinger.length == 0) {
            return;
        }
        this.config.bollinger.forEach(function (bollinger, i) {
            _this.svg
                .select("g.bollinger.boll-" + i + "." + _this.config.internalClassName)
                .call(_this.bollingers[i].refresh);
        });
    };
    Candlestick.prototype.drawAtrTrailingStop = function () {
        var _this = this;
        if (!this.config.atrTrailingStop ||
            this.config.atrTrailingStop.length == 0) {
            return;
        }
        this.candlestickData.atrTrailingStop = {};
        this.config.atrTrailingStop.forEach(function (period, i) {
            var atrTrailingStopi = techan.plot
                .atrtrailingstop()
                .xScale(_this.xScale)
                .yScale(_this.yScale);
            var indicator = techan.indicator.atrtrailingstop().period(period);
            if (_this.config.atrTrailingStopMultiplier) {
                indicator.multiplier(_this.config.atrTrailingStopMultiplier);
            }
            _this.candlestickData.atrTrailingStop[period] = indicator(_this.data);
            _this.atrTrailingStops.push(atrTrailingStopi);
            _this.svg
                .append("g")
                .attr("class", "indicator atrtrailingstop atrts-" +
                i +
                " " +
                _this.config.internalClassName)
                .attr("transform", "translate(0," + _this.config.dims.margin.top + ")")
                .attr("clip-path", "url(#".concat(_this.clipURL, ")"));
            _this.svg
                .select("g.atrtrailingstop.atrts-" + i + "." + _this.config.internalClassName)
                .datum(_this.candlestickData.atrTrailingStop[period])
                .call(atrTrailingStopi);
        });
    };
    Candlestick.prototype.refreshAtrTrailingStop = function () {
        var _this = this;
        if (!this.config.atrTrailingStop ||
            this.config.atrTrailingStop.length == 0) {
            return;
        }
        this.config.atrTrailingStop.forEach(function (atrTrailingStop, i) {
            _this.svg
                .select("g.atrtrailingstop.atrts-" + i + "." + _this.config.internalClassName)
                .call(_this.atrTrailingStops[i].refresh);
        });
    };
    Candlestick.prototype.drawIchimoku = function () {
        if (!this.config.ichimoku) {
            return;
        }
        this.candlestickData.ichimoku = {};
        var ichimokui = techan.plot
            .ichimoku()
            .xScale(this.xScale)
            .yScale(this.yScale);
        var indicator = techan.indicator.ichimoku();
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
            .attr("clip-path", "url(#".concat(this.clipURL, ")"));
        this.svg
            .select("g.ichimoku" + "." + this.config.internalClassName)
            .datum(this.candlestickData.ichimoku)
            .call(ichimokui);
    };
    Candlestick.prototype.refreshIchimoku = function () {
        if (!this.config.ichimoku) {
            return;
        }
        this.svg
            .select("g.ichimoku." + this.config.internalClassName)
            .call(this.ichimoku.refresh);
    };
    Candlestick.prototype.drawSMA = function () {
        var _this = this;
        if (!this.config.sma || this.config.sma.length == 0) {
            return;
        }
        this.candlestickData.sma = {};
        this.config.sma.forEach(function (period, i) {
            var smai = techan.plot.sma().xScale(_this.xScale).yScale(_this.yScale);
            _this.candlestickData.sma[period] = techan.indicator.sma().period(period)(_this.config.data);
            _this.smas.push(smai);
            _this.svg
                .append("g")
                .attr("class", "indicator sma ma-" + i + " " + _this.config.internalClassName)
                .attr("transform", "translate(0," + _this.config.dims.margin.top + ")")
                .attr("clip-path", "url(#".concat(_this.clipURL, ")"));
            _this.svg
                .select("g.sma.ma-" + i + "." + _this.config.internalClassName)
                .datum(_this.candlestickData.sma[period])
                .call(smai);
        });
    };
    Candlestick.prototype.refreshSMA = function () {
        var _this = this;
        if (!this.config.sma || this.config.sma.length == 0) {
            return;
        }
        this.config.sma.forEach(function (sma, i) {
            _this.svg
                .select("g .sma.ma-" + i + "." + _this.config.internalClassName)
                .call(_this.smas[i].refresh);
        });
    };
    Candlestick.prototype.drawEMA = function () {
        var _this = this;
        if (!this.config.ema || this.config.ema.length == 0) {
            return;
        }
        this.candlestickData.ema = {};
        this.config.ema.forEach(function (period, i) {
            var emai = techan.plot.ema().xScale(_this.xScale).yScale(_this.yScale);
            _this.candlestickData.ema[period] = techan.indicator.ema().period(period)(_this.config.data);
            _this.emas.push(emai);
            _this.svg
                .append("g")
                .attr("class", "indicator ema ma-" + i + " " + _this.config.internalClassName)
                .attr("transform", "translate(0," + _this.config.dims.margin.top + ")")
                .attr("clip-path", "url(#".concat(_this.clipURL, ")"));
            _this.svg
                .select("g.ema.ma-" + i + "." + _this.config.internalClassName)
                .datum(_this.candlestickData.ema[period])
                .call(emai);
        });
    };
    Candlestick.prototype.refreshEMA = function () {
        var _this = this;
        if (!this.config.ema || this.config.ema.length == 0) {
            return;
        }
        this.config.ema.forEach(function (ema, i) {
            _this.svg
                .select("g .ema.ma-" + i + "." + _this.config.internalClassName)
                .call(_this.emas[i].refresh);
        });
    };
    Candlestick.prototype.noTrades = function () {
        return (!this.config.showTrades ||
            !this.config.trades ||
            this.config.trades.length == 0);
    };
    Candlestick.prototype.drawTrades = function () {
        var _this = this;
        if (this.noTrades()) {
            return;
        }
        var dateFormat = d3.timeFormat("%d-%b"), valueFormat = d3.format(",.2f");
        var yearFormat = d3.timeFormat("%Y");
        this.svg
            .append("g")
            .attr("class", "tradearrow " + this.config.internalClassName);
        this.tradeText = this.svg
            .append("text")
            .style("text-anchor", "end")
            .attr("class", "coords " + this.config.internalClassName)
            .attr("x", this.config.dims.width - 5)
            .attr("y", 15);
        var enter = function (d) {
            _this.tradeText.style("display", "inline");
            var year = _this.config.hideYears
                ? "Yr " + (+yearFormat(d.date) - _this.baseYear + 1)
                : yearFormat(d.date);
            _this.tradeText.text("Trade: " +
                dateFormat(d.date) +
                ", " +
                year +
                " : " +
                d.type +
                ", " +
                valueFormat(d.price));
        };
        var out = function () {
            _this.tradeText.style("display", "none");
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
    };
    Candlestick.prototype.refreshTrades = function () {
        if (this.noTrades()) {
            return;
        }
        this.svg
            .selectAll("g.tradearrow")
            .datum(this.config.trades)
            .call(this.tradearrow);
    };
    Candlestick.prototype.drawVolume = function () {
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
            .attr("clip-path", "url(#".concat(this.clipURL, ")"));
        this.yVolumeScale.domain(techan.scale.plot.volume(this.config.data).domain());
        this.svg
            .select("g.volume." + this.config.internalClassName)
            .datum(this.config.data);
    };
    Candlestick.prototype.refreshVolume = function () {
        if (!this.config.showVolume) {
            return;
        }
        //use this if you want non-normalised y volumes
        // this.yVolumeScale.domain(
        //   techan.scale.plot.volume(this.config.data).domain()
        // );
        //normalised y-volume
        var brushedData = Array.prototype.slice.apply(this.config.data, this.xScale.zoomable().domain());
        // console.log("brushed data: ", brushedData);
        // console.log(
        //   "volume domain:",
        //   techan.scale.plot.volume(brushedData).domain()
        // );
        this.yVolumeScale.domain(techan.scale.plot.volume(brushedData).domain());
        this.svg
            .select("g.volume." + this.config.internalClassName)
            .call(this.volume);
    };
    Candlestick.prototype.drawCrosshair = function () {
        //super.drawCrosshair();
        this.crosshair = techan.plot
            .crosshair()
            .xScale(this.xScale)
            .yScale(this.yScale);
        var xAnnotationArr = [];
        var yAnnotationArr = [];
        if (this.config.showRightAxis) {
            var ohlcAnnotation = techan.plot
                .axisannotation()
                .axis(this.yAxisRight)
                .orient("right")
                .format(d3.format(",.2f"))
                .translate([this.xScale(1), 0]);
            yAnnotationArr.push(ohlcAnnotation);
        }
        if (this.config.showVolume) {
            var volumeAnnotation = techan.plot
                .axisannotation()
                .axis(this.yAxisVolume)
                .orient("right")
                .format(billionsFormatter());
            yAnnotationArr.push(volumeAnnotation);
        }
        var percentageAnnotation = techan.plot
            .axisannotation()
            .axis(this.yAxis)
            .orient("left")
            .format(d3.format("+.1%"));
        var priceAnnotation = techan.plot
            .axisannotation()
            .axis(this.yAxis)
            .orient("left")
            .format(d3.format(",.2f"));
        var leftAxisAnnotation;
        if (this.config.showPriceInLeftAxis) {
            leftAxisAnnotation = priceAnnotation;
        }
        else {
            leftAxisAnnotation = percentageAnnotation;
        }
        yAnnotationArr.push(leftAxisAnnotation);
        if (!this.config.hideXAxis) {
            var timeAnnotation = techan.plot
                .axisannotation()
                .axis(this.xAxis)
                .orient("bottom")
                .format(yearsFormatter(this.baseYear, this.config.hideYears))
                .width(65)
                .translate([0, this.config.dims.height]);
            xAnnotationArr.push(timeAnnotation);
        }
        if (this.config.showTopAxis) {
            var timeAnnotationTop = techan.plot
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
    };
    Candlestick.prototype.drawAxisTop = function () {
        if (!this.config.showTopAxis) {
            return;
        }
        this.xAxisTop = d3.axisTop(this.xScale);
        applyTicks(this.xAxisTop, this.config.topAxisTicks);
        this.svg
            .append("g")
            .attr("class", "x axis top candlestick-axis hide-years " +
            this.config.internalClassName);
    };
    Candlestick.prototype.refreshAxisTop = function () {
        if (!this.config.showTopAxis) {
            return;
        }
        this.svg
            .selectAll("g.x.axis.top.candlestick-axis." + this.config.internalClassName)
            .call(this.xAxisTop);
    };
    Candlestick.prototype.drawAxisRight = function () {
        if (!this.config.showRightAxis) {
            return;
        }
        this.yAxisRight = d3.axisRight(this.yScale);
        applyTicks(this.yAxisRight, this.config.rightAxisTicks);
        this.svg
            .append("g")
            .attr("class", "y axis right candlestick-axis " + this.config.internalClassName)
            .attr("transform", "translate(" + this.config.dims.width + ",0)")
            .append("text")
            .attr("transform", "translate(28," + this.config.dims.margin.top + ")")
            .attr("y", 6)
            .attr("dy", "-2.1em")
            .style("text-anchor", "end")
            .text(this.config.rightAxisLabel || "Price");
    };
    Candlestick.prototype.refreshAxisRight = function () {
        if (!this.config.showRightAxis) {
            return;
        }
        this.svg
            .selectAll("g.y.axis.right.candlestick-axis." + this.config.internalClassName)
            .call(this.yAxisRight);
    };
    Candlestick.prototype.drawAxisVolume = function () {
        if (!this.config.showVolume) {
            return;
        }
        this.yAxisVolume = d3
            .axisRight(this.yVolumeScale)
            .tickFormat(billionsFormatter(",.2s"));
        applyTicks(this.yAxisVolume, this.config.volumeAxisTicks);
        this.svg
            .append("g")
            .attr("class", "y axis volume-axis candlestick-axis " + this.config.internalClassName)
            .attr("transform", "rotate(-90)")
            .attr("transform", "translate(0," + this.config.dims.margin.top + ")");
    };
    Candlestick.prototype.refreshAxisVolume = function () {
        if (!this.config.showVolume) {
            return;
        }
        this.svg
            .selectAll("g.y.axis.volume-axis." + this.config.internalClassName)
            .call(this.yAxisVolume);
    };
    Candlestick.prototype.drawAxisBottom = function () {
        this.xAxis = d3.axisBottom(this.xScale);
        applyTicks(this.xAxis, this.config.bottomAxisTicks);
        var height = this.config.dims.height;
        var marginTop = this.config.dims.margin.top;
        if (!this.config.hideXAxis) {
            this.svg
                .append("g")
                .attr("class", "x axis bottom candlestick-axis " + this.config.internalClassName)
                .attr("transform", "translate(0," + marginTop + height + ")");
        }
    };
    Candlestick.prototype.refreshAxisBottom = function () {
        if (!this.config.hideXAxis) {
            this.svg
                .selectAll("g.x.axis.candlestick-axis.bottom." + this.config.internalClassName)
                .call(this.xAxis);
        }
    };
    Candlestick.prototype.drawAxisLeft = function () {
        if (this.config.showPriceInLeftAxis) {
            this.yAxis = d3.axisLeft(this.yScale);
        }
        else {
            this.yAxis = d3.axisLeft(this.yPercentScale).tickFormat(d3.format("+.1%"));
        }
        applyTicks(this.yAxis, this.config.leftAxisTicks);
        var yAxisSvg = this.svg
            .append("g")
            .attr("class", "y axis left candlestick-axis " + this.config.internalClassName);
        var yLabel = this.config.yLabel || this.config.showPriceInLeftAxis ? "Price" : "Percent";
        var marginTop = this.config.dims.margin.top;
        yAxisSvg
            .append("text")
            .attr("transform", "translate(0," + marginTop + ")")
            .attr("y", 6)
            .attr("dy", "-2.1em")
            .style("text-anchor", "end")
            .text(yLabel);
    };
    Candlestick.prototype.refreshAxisLeft = function () {
        this.svg
            .selectAll("g.y.axis.candlestick-axis.left." + this.config.internalClassName)
            .call(this.yAxis);
    };
    Candlestick.prototype.drawChart = function () {
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
        var marginTop = this.config.dims.margin.top;
        this.svg
            .append("g")
            .attr("class", "candlestick " + this.config.internalClassName)
            .attr("transform", "translate(0," + marginTop + ")")
            .attr("clip-path", "url(#".concat(this.clipURL, ")"));
    };
    Candlestick.prototype.refreshChart = function () {
        this.svg
            .selectAll("g.candlestick." + this.config.internalClassName)
            .datum(this.config.data)
            .call(this.chart);
    };
    Candlestick.prototype.drawScales = function () {
        //skip the first two weeks of data to get indicator sync. Indicator data starts after 2 weeks and we wnat the indiactor axes to be in sync with the other data axes. So we skip the initial data.
        //UPDATE we are no longer diong this
        //if the preroll cut off strategy is desired then enable this again and instead of 14 use the greatest period.
        //this.xScale.domain(this.config.data.slice(14).map(this.chart.accessor().d));
        this.xScale.domain(this.config.data.map(this.chart.accessor().d));
        this.yScale.domain(techan.scale.plot
            .ohlc(this.config.data.slice(14), this.chart.accessor())
            .domain());
    };
    Candlestick.prototype.refreshScales = function () {
        this.yScale.domain(techan.scale.plot
            .ohlc(this.config.data.slice.apply(this.config.data, this.xScale.zoomable().domain()), this.chart.accessor())
            .domain());
        this.yPercentScale.domain(techan.scale.plot.percent(this.yScale, this.data[0].close).domain());
    };
    //update: this is not being used.
    Candlestick.prototype.applyAllTicks = function () {
        //TODO is this required?
        applyTicks(this.xAxis, this.config.bottomAxisTicks);
        applyTicks(this.yAxis, this.config.leftAxisTicks);
        applyTicks(this.yAxisVolume, this.config.volumeAxisTicks);
        applyTicks(this.xAxisTop, this.config.topAxisTicks);
        applyTicks(this.yAxisRight, this.config.rightAxisTicks);
    };
    Candlestick.prototype.draw = function () {
        if (this.config.hide) {
            return;
        }
        _super.prototype.draw.call(this);
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
    };
    Candlestick.prototype.update = function () {
        _super.prototype.update.call(this);
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
        _super.prototype.postupdate.call(this);
    };
    return Candlestick;
}(Chart));
var Ohlc = /** @class */ (function (_super) {
    __extends(Ohlc, _super);
    function Ohlc(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.chartsProvider = chartsProvider;
        _this.clipURL = "clip-ohlc-" + _this.config.internalClassName;
        return _this;
    }
    Ohlc.prototype.drawChart = function () {
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
        var marginTop = this.config.dims.margin.top;
        this.svg
            .append("g")
            .attr("class", "candlestick " + this.config.internalClassName)
            .attr("transform", "translate(0," + marginTop + ")")
            .attr("clip-path", "url(#".concat(this.clipURL, ")"));
    };
    Ohlc.prototype.refreshChart = function () {
        this.svg
            .selectAll("g.candlestick." + this.config.internalClassName)
            .datum(this.config.data)
            .call(this.chart);
    };
    Ohlc.prototype.draw = function () {
        _super.prototype.draw.call(this);
    };
    return Ohlc;
}(Candlestick));
var Portfolio = /** @class */ (function (_super) {
    __extends(Portfolio, _super);
    function Portfolio(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.chartsProvider = chartsProvider;
        return _this;
        //hide indicator pre-roll to get the charts in sync
        //this.data = this.data.slice(33);
    }
    Portfolio.prototype.getData = function (date) {
        _super.prototype.getData.call(this, date);
        return filterByDate(this.data, date);
    };
    Portfolio.prototype.drawAxisRight = function () {
        if (!this.config.showRightAxis) {
            return;
        }
        this.yAxisRight = d3
            .axisRight(this.yPercentScale)
            .tickFormat(d3.format("+.1%"));
        applyTicks(this.yAxisRight, this.config.rightAxisTicks);
        this.chartSvg
            .append("g")
            .attr("class", "y axis portfolio-axis right " + this.config.internalClassName)
            .attr("transform", "translate(" + this.config.dims.width + ",0)");
    };
    Portfolio.prototype.refreshAxisRight = function () {
        if (!this.config.showRightAxis) {
            return;
        }
        this.svg
            .selectAll("g.y.axis.portfolio-axis.right." + this.config.internalClassName)
            .call(this.yAxisRight);
    };
    Portfolio.prototype.draw = function () {
        var _this = this;
        if (this.config.hide) {
            return;
        }
        _super.prototype.draw.call(this);
        this.yPercentScale = d3.scaleLinear().range([this.config.dims.height, 0]);
        this.yAxis = d3.axisLeft(this.yScale).tickFormat(function (d) { return d3.format("+.0%")(d); });
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
        this.portfolioData = this.data.portfolio.map(function (d) {
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
        this.adjCloseData = this.data.adjClose.map(function (d) {
            return {
                date: d.date,
                open: +d.value,
                high: +d.value,
                low: +d.value,
                close: +d.value,
                volume: 0,
            };
        });
        var scale = function (data) {
            var origin = data[0].close;
            // const max = Math.max(...data.map(d => d.close));
            // const min = Math.min(...data.map(d => d.close));
            var factor;
            if (origin == 0) {
                var max_1 = Math.max.apply(Math, data.map(function (d) { return d.close; }));
                if (max_1 == 0) {
                    factor = function (x) { return x; };
                }
                else {
                    factor = function (x) { return ((x - origin) / max_1); };
                }
            }
            else {
                // if (max / origin > 100) {
                //   if (origin / min > max / origin) {
                //     factor = x => ((min - origin) / (-100) * (x - origin) + min)
                //   } else {
                //     factor = x => ((max - origin) / (100) * (x - origin) + max)
                //   }
                // }
                // else {
                factor = function (x) { return ((x - origin) / origin); };
                // }
            }
            var d = data.map(function (d) {
                return {
                    date: d.date,
                    open: factor(+d.open),
                    high: factor(+d.high),
                    low: factor(+d.low),
                    close: factor(+d.close),
                    volume: +d.volume
                };
            });
            return d;
        };
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
            .attr("class", "x axis bottom portfolio-axis " + this.config.internalClassName)
            .attr("transform", "translate(0," + this.config.dims.height + ")");
        this.chartSvg
            .append("g")
            .attr("class", "y axis left portfolio-axis " + this.config.internalClassName)
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
        var brushed = function (target, type, selection, sourceEvent, mode) {
            if (_this.chartsProvider.brushed && _this.chartsProvider.config.minimumBrushSize) {
                if (_this.chartsProvider.getBrushSize().tradingDays < _this.chartsProvider.config.minimumBrushSize) {
                    _this.chartsProvider.brushCallbacks.forEach(function (cb) { return cb(false, target, type, selection, sourceEvent, mode); });
                    _this.chartsProvider.clearBrush();
                    return;
                }
            }
            if (_this.chartsProvider.brushed && _this.chartsProvider.brushCallbacks.length > 0) {
                _this.chartsProvider.brushCallbacks.forEach(function (cb) { return cb(true, target, type, selection, sourceEvent, mode); });
            }
            var refZoomable = _this.xScale.zoomable();
            _this.config.brushTargets.forEach(function (_a) {
                var scale = _a.scale, update = _a.update, chart = _a.chart;
                var zoomable = scale.zoomable();
                zoomable.domain(refZoomable.domain());
                if (d3.event.selection !== null) {
                    var range = d3.event.selection;
                    var domain = range.map(zoomable.invert);
                    domain = domain.map(Math.round);
                    // if(!chart.isIndicator()){
                    //   domain[0]+=11;
                    //   domain[1]+=11;
                    // }
                    zoomable.domain(domain);
                }
                update();
            });
        };
        this.brush = d3
            .brushX()
            .extent([
            [0, 0],
            [this.config.dims.width, this.config.dims.height],
        ])
            .on("end", brushed);
        if (d3.select(".dynamic-label-portfolio").empty()) {
            d3
                .select("body")
                .append("div")
                .attr("class", "dynamic-label-portfolio")
                .style("opacity", 0);
        }
        this.update();
    };
    Portfolio.prototype.postupdate = function () {
        _super.prototype.postupdate.call(this);
    };
    Portfolio.prototype.update = function () {
        var _a;
        var _this = this;
        _super.prototype.update.call(this);
        this.xScale.domain(this.closeData.map(this.portfolio.accessor().d));
        var extents = [];
        if (this.config.showClose) {
            extents.push(techan.scale.plot
                .ohlc(this.closeData, this.close.accessor())
                .domain());
        }
        if (this.config.showPortfolio) {
            extents.push(techan.scale.plot
                .ohlc(this.portfolioData, this.portfolio.accessor())
                .domain());
        }
        if (this.config.showAdjClose) {
            extents.push(techan.scale.plot
                .ohlc(this.adjCloseData, this.adjClose.accessor())
                .domain());
        }
        this.yScale.domain(d3.extent((_a = Array.prototype).concat.apply(_a, extents)));
        this.yPercentScale.domain(techan.scale.plot
            .percent(this.yScale, this.closeData[0].close)
            .domain());
        this.chartSvg
            .select("g.pane")
            .call(this.brush)
            .selectAll("rect")
            .attr("height", this.config.dims.height);
        if (this.config.showZeroLine) {
            this.svg.selectAll("g.zero-chart." + this.config.internalClassName)
                .datum(this.adjCloseData.map(function (x) { return (__assign(__assign({}, x), { close: _this.adjCloseData[0].close })); }))
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
        var labelDiv = d3
            .select(".dynamic-label-portfolio")
            .style("opacity", 0);
        var showTooltip = function (text) {
            return function () {
                this.classList.add("highlighted");
                labelDiv.transition().duration(200).style("opacity", 0.9);
                labelDiv
                    .html(text)
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY - 28 + "px");
            };
        };
        var hideTooltip = function () {
            return function () {
                this.classList.remove("highlighted");
                labelDiv.transition().duration(500).style("opacity", 0);
            };
        };
        var addTooltip = function (selector, text) {
            //console.log(text);
            _this.chartSvg.select(selector).raise();
            _this.chartSvg
                .select(selector + " path.line")
                .on("mouseover", showTooltip(text))
                .on("mouseout", hideTooltip());
        };
        addTooltip(".portfolio-chart", this.config.portfolioTooltip || "Portfolio");
        addTooltip(".adj-close-chart", this.config.adjCloseTooltip || "Adj. Close");
        addTooltip(".close-chart", this.config.closeTooltip || "Close");
        this.postupdate();
    };
    return Portfolio;
}(Chart));
var Indicator = /** @class */ (function (_super) {
    __extends(Indicator, _super);
    function Indicator(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        _this.period = 0;
        _this.name = _this.constructor.name.toLowerCase();
        return _this;
    }
    Indicator.prototype.isIndicator = function () {
        return true;
    };
    Indicator.prototype.getData = function (d) {
        _super.prototype.getData.call(this, d);
        return this.indicatorData.find(function (x) {
            var d2 = x.date;
            return d.toLocaleDateString("en-US") == d2.toLocaleDateString("en-US");
        });
    };
    Indicator.prototype.drawAxisRight = function () {
        if (!this.config.hideRightAxis) {
            this.yAxisRight = d3.axisRight(this.yScale);
            this.yAxisRight.tickFormat(billionsFormatter()); //.tickFormat(d3.format(",.1f")).tickPadding([-20]);
            applyTicks(this.yAxisRight, this.config.rightAxisTicks);
            this.chartSvg
                .append("g")
                .attr("class", "y axis right indicator-axis " + this.config.internalClassName)
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
    };
    Indicator.prototype.refreshAxisRight = function () {
        if (this.config.hideRightAxis) {
            return;
        }
        this.svg
            .selectAll("g.y.axis.right.indicator-axis." + this.config.internalClassName)
            .call(this.yAxisRight);
    };
    Indicator.prototype.getIndicatorData = function () {
        return techan.indicator[this.name]()(this.data);
    };
    Indicator.prototype.draw = function () {
        if (this.config.hide) {
            return;
        }
        _super.prototype.draw.call(this);
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
            .attr("clip-path", "url(#clip-indicator-" + this.config.internalClassName + ")");
        if (!this.config.hideXAxis) {
            this.chartSvg
                .append("g")
                .attr("class", "x axis hide-years " + this.config.internalClassName)
                .attr("transform", "translate(0," + this.config.dims.height + ")");
        }
        this.chartSvg
            .append("g")
            .attr("class", "y axis left indicator-axis " + this.config.internalClassName)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("x", -7)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(this.config.yLabel ||
            this.name.charAt(0).toUpperCase() + this.name.slice(1));
        this.drawAxisRight();
        var ohlcAnnotation = techan.plot
            .axisannotation()
            .axis(this.yAxis)
            .orient("left")
            .format(d3.format(",.2f"));
        var timeAnnotation = techan.plot
            .axisannotation()
            .axis(this.xAxis)
            .orient("bottom")
            .format(yearsFormatter(this.baseYear, this.config.hideYears))
            .width(65)
            .translate([0, this.config.dims.height]);
        var crosshair = techan.plot
            .crosshair()
            .xScale(this.xScale)
            .yScale(this.yScale)
            .xAnnotation(timeAnnotation)
            .yAnnotation(ohlcAnnotation);
        this.chartSvg.append("g").attr("class", "crosshair").call(crosshair);
        this.indicatorData = this.getIndicatorData();
        //this.xScale.domain(this.indicatorData.map(this.indicator.accessor().d));
        //using the strategy where we show the indicator in the preroll portion as well. We do not cut it off. There's just no data for those dates. If preroll cut off is needed use something like the above commented out line and calculate which indicator amongst the ones enabled has the greatest period. Then slice that much data from all the charts including the other indicators. But for the other indicators you also have to consider their own preroll. So accordingly reduce the slice. Check out candlestick.drawScales or search for "14".
        this.xScale.domain(this.data.map(function (x) { return x.date; }));
        this.svg
            .selectAll("g." + this.name + "." + this.config.internalClassName)
            .datum(this.indicatorData)
            .call(this.indicator);
        this.update();
    };
    Indicator.prototype.update = function () {
        _super.prototype.update.call(this);
        // if (this.period) {
        //   this.indicatorData = techan.indicator[this.name]().period(this.period)(
        //     this.data
        //   );
        // } else {
        //   this.indicatorData = techan.indicator[this.name]()(this.data);
        // }
        var brushedData = Array.prototype.slice.apply(this.indicatorData, this.xScale.zoomable().domain());
        if (this.name == "heikinashi") {
            this.yScale.domain(techan.scale.plot.ohlc(brushedData, this.indicator.accessor()).domain());
        }
        else {
            this.yScale.domain(techan.scale.plot[this.name](brushedData).domain());
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
        _super.prototype.postupdate.call(this);
    };
    return Indicator;
}(Chart));
var PeriodicIndicator = /** @class */ (function (_super) {
    __extends(PeriodicIndicator, _super);
    function PeriodicIndicator(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        if (_this.config.period) {
            _this.period = _this.config.period;
        }
        return _this;
    }
    PeriodicIndicator.prototype.getIndicatorData = function () {
        if (this.period) {
            return techan.indicator[this.name]().period(this.period)(this.data);
        }
        else {
            return _super.prototype.getIndicatorData.call(this);
        }
    };
    return PeriodicIndicator;
}(Indicator));
var Atr = /** @class */ (function (_super) {
    __extends(Atr, _super);
    function Atr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Atr;
}(PeriodicIndicator));
var Adx = /** @class */ (function (_super) {
    __extends(Adx, _super);
    function Adx() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Adx;
}(PeriodicIndicator));
var Aroon = /** @class */ (function (_super) {
    __extends(Aroon, _super);
    function Aroon(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        return _this;
    }
    Aroon.prototype.getIndicatorData = function () {
        var ind = techan.indicator[this.name]();
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
    };
    return Aroon;
}(PeriodicIndicator));
var AtrTrailingStop = /** @class */ (function (_super) {
    __extends(AtrTrailingStop, _super);
    function AtrTrailingStop(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        return _this;
    }
    AtrTrailingStop.prototype.getIndicatorData = function () {
        var ind = techan.indicator[this.name]();
        if (this.config.multiplier) {
            ind.multiplier(this.config.multiplier);
        }
        return ind(this.data);
    };
    return AtrTrailingStop;
}(PeriodicIndicator));
var Heikinashi = /** @class */ (function (_super) {
    __extends(Heikinashi, _super);
    function Heikinashi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Heikinashi;
}(Indicator));
var Ichimoku = /** @class */ (function (_super) {
    __extends(Ichimoku, _super);
    function Ichimoku(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        return _this;
    }
    Ichimoku.prototype.getIndicatorData = function () {
        var ind = techan.indicator[this.name]();
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
    };
    return Ichimoku;
}(Indicator));
var Macd = /** @class */ (function (_super) {
    __extends(Macd, _super);
    function Macd(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        return _this;
    }
    Macd.prototype.getIndicatorData = function () {
        var ind = techan.indicator[this.name]();
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
    };
    return Macd;
}(Indicator));
var Rsi = /** @class */ (function (_super) {
    __extends(Rsi, _super);
    function Rsi(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        return _this;
    }
    Rsi.prototype.getIndicatorData = function () {
        var ind = techan.indicator[this.name]();
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
    };
    return Rsi;
}(PeriodicIndicator));
var Stochastic = /** @class */ (function (_super) {
    __extends(Stochastic, _super);
    function Stochastic(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        return _this;
    }
    Stochastic.prototype.getIndicatorData = function () {
        var ind = techan.indicator[this.name]();
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
    };
    return Stochastic;
}(PeriodicIndicator));
var Williams = /** @class */ (function (_super) {
    __extends(Williams, _super);
    function Williams(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        return _this;
    }
    Williams.prototype.getIndicatorData = function () {
        var ind = techan.indicator[this.name]();
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
    };
    return Williams;
}(PeriodicIndicator));
var Bollinger = /** @class */ (function (_super) {
    __extends(Bollinger, _super);
    function Bollinger(config, chartsProvider) {
        var _this = _super.call(this, config, chartsProvider) || this;
        _this.config = config;
        _this.chartsProvider = chartsProvider;
        return _this;
    }
    Bollinger.prototype.getIndicatorData = function () {
        var ind = techan.indicator[this.name]();
        if (this.config.sdMultiplication) {
            ind.sdMultiplication(this.config.sdMultiplication);
        }
        return ind(this.data);
    };
    return Bollinger;
}(PeriodicIndicator));
var Sroc = /** @class */ (function (_super) {
    __extends(Sroc, _super);
    function Sroc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Sroc;
}(PeriodicIndicator));
var Vwap = /** @class */ (function (_super) {
    __extends(Vwap, _super);
    function Vwap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Vwap;
}(PeriodicIndicator));
var chartMap = {
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
function applyTicks(axis, ticks) {
    if (ticks) {
        axis.ticks(ticks);
    }
}
var billionsFormatter = function (format) {
    if (format === void 0) { format = ",.3s"; }
    return function (d) {
        var res = d3.format(format)(d);
        res = res.replace("G", "B").replace("P", "000T");
        return res;
    };
};
var yearsFormatter = function (baseYear, hideYears) {
    return function (d) {
        var res = d3.timeFormat("%Y-%m-%d")(d);
        if (!hideYears) {
            return res;
        }
        var parts = res.split("-");
        var year = parts[0];
        var yrNo = +year - +baseYear + 1;
        return "".concat(parts[1], "-").concat(parts[2], ", Yr ").concat(yrNo);
    };
};
function filterByDate(data, date, parentKey, out) {
    if (!out) {
        out = {};
    }
    if (typeof data === "object" && !Array.isArray(data) && data !== null) {
        for (var k in data) {
            if (parentKey) {
                out[parentKey] = {};
            }
            filterByDate(data[k], date, k, out[parentKey] || out);
        }
    }
    else {
        if (Array.isArray(data)) {
            if ("date" in data[0]) {
                var filteredData = data.find(function (z) {
                    var d2 = z.date;
                    return (date.toLocaleDateString("en-US") == d2.toLocaleDateString("en-US"));
                });
                //delete filteredData.date;
                out[parentKey] = cloneDeep(filteredData);
                delete out[parentKey].date;
            }
        }
    }
    return out;
}
//# sourceMappingURL=charts.js.map