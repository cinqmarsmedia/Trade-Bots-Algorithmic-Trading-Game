import * as tw from 'trendyways';
var period = 1;
var Supstance = /** @class */ (function () {
    function Supstance() {
    }
    //calculate the horizontal lines using the ohlc data
    Supstance.prototype.calculate = function (data, algorithm) {
        switch (algorithm.name) {
            case "floor": {
                var floorValues = tw.floorPivots(data.slice(data.length - 1).map(function (x) { return ({ c: x.close, h: x.high, l: x.low }); }));
                var _a = floorValues[0].floor, pl = _a.pl, r1 = _a.r1, r2 = _a.r2, r3_1 = _a.r3, s1 = _a.s1, s2 = _a.s2, s3_1 = _a.s3;
                this.currentData = [pl, r1, r2, r3_1, s1, s2, s3_1];
                break;
            }
            case "woodie": {
                var woodieValues = tw.woodiesPoints(data.slice(data.length - period).map(function (x) { return ({ c: x.close, h: x.high, l: x.low }); }));
                var _b = woodieValues[0].wood, pivot = _b.pivot, r1 = _b.r1, r2 = _b.r2, s1 = _b.s1, s2 = _b.s2;
                var r3 = woodieValues[0].h + 2 * (pivot - woodieValues[0].l);
                var s3 = woodieValues[0].l - 2 * (woodieValues[0].h - pivot);
                this.currentData = [pivot, r1, r2, r3, s1, s2, s3];
                break;
            }
            case "camarilla": {
                var camValues = tw.camarillaPoints(data.slice(data.length - period).map(function (x) { return ({ c: x.close, h: x.high, l: x.low }); }));
                console.log(camValues);
                var _c = camValues[0].cam, r1 = _c.r1, r2 = _c.r2, r3_2 = _c.r3, s1 = _c.s1, s2 = _c.s2, s3_2 = _c.s3, s4 = _c.s4, r4 = _c.r4;
                this.currentData = [(r1 + s1) / 2, r2, r3_2, r4, s2, s3_2, s4];
                break;
            }
            case "fibonacci": {
                var fib = tw.fibonacciRetrs(data.slice(data.length - period).map(function (x) { return ({ c: x.close, h: x.high, l: x.low }); }));
                this.currentData = [(fib[2] + fib[3]) / 2, fib[2], fib[1], fib[0], fib[3], fib[4], fib[5]];
                break;
            }
        }
        return this.currentData;
    };
    return Supstance;
}());
var supstance = new Supstance();
export { supstance as Supstance };
//# sourceMappingURL=supstance.js.map