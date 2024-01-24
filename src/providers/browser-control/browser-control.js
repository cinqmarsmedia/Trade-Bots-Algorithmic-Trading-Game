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
import "rxjs/add/operator/map";
import isElectron from "is-electron";
var BrowserControlProvider = /** @class */ (function () {
    function BrowserControlProvider() {
        this._enabled = false;
        this._url = "";
        this._loaded = false;
        this._usingElectron = false;
        if (isElectron()) {
            this._usingElectron = true;
        }
    }
    BrowserControlProvider.prototype.initBrowser = function (url) {
        //console.log(url);
        if (url.match(/\/@[A-Z][a-z]/g)) {
            var rez = url.match(/\/@.*/g);
            var underscore = rez[0].replace(/([a-z])([A-Z])/g, "$1_$2");
            underscore = underscore.replace("/@", "");
            var newURL = "#/social?" + underscore;
            self.location.href = newURL;
            return;
        }
        /*
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
       
    }
    */
        if (this._usingElectron) {
            this.setURL(url);
            this.show();
        }
        else {
            console.warn("opening browser tab, not an electron enviornment");
            window.open(url, "_blank");
        }
    };
    BrowserControlProvider.prototype.show = function () {
        if (this.enabled) {
            return;
        }
        if (this._usingElectron) {
            this._enabled = true;
            if (this._url) {
                this.loadURL()
                    .then(function () { })
                    .catch(function (err) {
                    console.log(err);
                });
            }
        }
        else {
            console.log("opening tab, not electron enviornment");
            window.open(this._url, "_blank");
        }
    };
    BrowserControlProvider.prototype.hide = function () {
        var _this = this;
        if (!this.enabled) {
            return;
        }
        this.component.webView.nativeElement.stop();
        this.setURL("about:blank").then(function () {
            _this._enabled = false;
        });
    };
    BrowserControlProvider.prototype.setURL = function (url) {
        this._url = url;
        if (this._enabled) {
            return this.loadURL()
                .then(function () { })
                .catch(function (err) {
                console.log(err);
            });
        }
        else {
            return Promise.resolve();
        }
    };
    Object.defineProperty(BrowserControlProvider.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserControlProvider.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserControlProvider.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: false,
        configurable: true
    });
    BrowserControlProvider.prototype.loadURL = function () {
        var _this = this;
        if (!this.component || !this.component.webView) {
            console.warn("No component or webview loaded");
            return Promise.resolve();
        }
        return new Promise(function (res, rej) {
            _this.component.webView.nativeElement
                .loadURL(_this._url)
                .then(function () {
                _this.reportLoadEnd();
                res();
            })
                .catch(function (err) {
                _this.reportLoadEnd({ err: err });
                rej(err);
            });
        });
    };
    Object.defineProperty(BrowserControlProvider.prototype, "usingElectron", {
        get: function () {
            return this._usingElectron;
        },
        enumerable: false,
        configurable: true
    });
    BrowserControlProvider.prototype.registerComponent = function (component) {
        var _this = this;
        this.component = component;
        setTimeout(function () {
            _this.component.webView.nativeElement.addEventListener("load-commit", function () {
                _this.component.webView.nativeElement.insertCSS('#searchform{display:none !important}#sfcnt{height:0px !important}#knowledge-finance-wholepage__entity-summary{display:none !important}[data-initq] { display: none !important}');
            });
        }, 0);
    };
    BrowserControlProvider.prototype.deregisterComponent = function (component) {
        this.component = null;
    };
    BrowserControlProvider.prototype.reportLoadEnd = function (loadError) {
        if (loadError === void 0) { loadError = null; }
        this._loaded = true;
        this.loadError = loadError;
        if (loadError) {
            console.warn("browser-control: failed to load page");
        }
    };
    BrowserControlProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], BrowserControlProvider);
    return BrowserControlProvider;
}());
export { BrowserControlProvider };
//# sourceMappingURL=browser-control.js.map