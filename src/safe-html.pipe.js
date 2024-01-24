var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
var sanHtmlPipe = /** @class */ (function () {
    function sanHtmlPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    sanHtmlPipe.prototype.transform = function (content) {
        return this.sanitizer.bypassSecurityTrustHtml(content || "");
    };
    sanHtmlPipe = __decorate([
        Pipe({ name: 'safeHtml', pure: true }),
        __metadata("design:paramtypes", [DomSanitizer])
    ], sanHtmlPipe);
    return sanHtmlPipe;
}());
export { sanHtmlPipe };
//# sourceMappingURL=safe-html.pipe.js.map