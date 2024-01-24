var BaklavaState = /** @class */ (function () {
    function BaklavaState() {
        this.state = {};
    }
    BaklavaState.prototype.setState = function (key, value) {
        this.state[key] = value;
    };
    BaklavaState.prototype.getState = function (key) {
        return this.state[key];
    };
    return BaklavaState;
}());
var baklavaState = new BaklavaState();
export { baklavaState as BaklavaState };
//# sourceMappingURL=baklavaState.js.map