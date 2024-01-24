var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { BrowserControlProvider } from '../../providers/browser-control/browser-control';
/**
 * Generated class for the CustomBrowserComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var CustomBrowserComponent = /** @class */ (function () {
    function CustomBrowserComponent(browserControl) {
        this.browserControl = browserControl;
        this.showSpinner = false;
        this.browserControl.registerComponent(this);
        this.showWebView = this.browserControl.usingElectron;
    }
    CustomBrowserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.webView.nativeElement.addEventListener('did-start-loading', function () {
            _this.showSpinner = true;
        });
        this.webView.nativeElement.addEventListener('load-commit', function () {
            _this.showSpinner = false;
        });
    };
    CustomBrowserComponent.prototype.ngOnDestroy = function () {
        this.browserControl.deregisterComponent(this);
    };
    __decorate([
        ViewChild('webview'),
        __metadata("design:type", ElementRef)
    ], CustomBrowserComponent.prototype, "webView", void 0);
    CustomBrowserComponent = __decorate([
        Component({
            selector: 'custom-browser',
            templateUrl: 'custom-browser.html'
        }),
        __metadata("design:paramtypes", [BrowserControlProvider])
    ], CustomBrowserComponent);
    return CustomBrowserComponent;
}());
export { CustomBrowserComponent };
//# sourceMappingURL=custom-browser.js.map