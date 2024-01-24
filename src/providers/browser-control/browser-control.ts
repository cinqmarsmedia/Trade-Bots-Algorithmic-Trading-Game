import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import isElectron from "is-electron";

@Injectable()
export class BrowserControlProvider {
  private _enabled: boolean = false;
  private _url: string = "";
  private _loaded: boolean = false;
  private _usingElectron: boolean = false;
  private component: any;
  public loadError: null;

  constructor() {
    if (isElectron()) {

      this._usingElectron = true;
    }
  }

  public initBrowser(url) {
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
    } else {
      console.warn("opening browser tab, not an electron enviornment");
      window.open(url, "_blank");
    }
  }

  public show() {
    if (this.enabled) {
      return;
    }
    if (this._usingElectron) {
    this._enabled = true;
    if (this._url) {

      
      this.loadURL()
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });}
    }else{
      console.log("opening tab, not electron enviornment");
      window.open(this._url, "_blank");
    }
  }
  public hide() {
    if (!this.enabled) {
      return;
    }
    this.component.webView.nativeElement.stop();
    this.setURL("about:blank").then(() => {
      this._enabled = false;
    });
  }
  public setURL(url: string): Promise<any> {
    this._url = url;
    if (this._enabled) {
      return this.loadURL()
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    } else {
      return Promise.resolve();
    }
  }

  public get enabled(): boolean {
    return this._enabled;
  }
  public get loaded(): boolean {
    return this._loaded;
  }
  public get url(): string {
    return this._url;
  }

  private loadURL(): Promise<void> {
    if (!this.component || !this.component.webView) {
      console.warn("No component or webview loaded");
      return Promise.resolve();
    }
    return new Promise((res, rej) => {
      this.component.webView.nativeElement
        .loadURL(this._url)
        .then(() => {
          this.reportLoadEnd();
          res();
        })
        .catch((err) => {
          this.reportLoadEnd({ err });
          rej(err);
        });
    });
  }

  public get usingElectron(): boolean {
    return this._usingElectron;
  }

  public registerComponent(component: any) {
    this.component = component;

    setTimeout(() => {
      this.component.webView.nativeElement.addEventListener("load-commit", () => {
      this.component.webView.nativeElement.insertCSS('#searchform{display:none !important}#sfcnt{height:0px !important}#knowledge-finance-wholepage__entity-summary{display:none !important}[data-initq] { display: none !important}')
      });
    }, 0);
  }
  public deregisterComponent(component: any) {
    this.component = null;
  }

  private reportLoadEnd(loadError: any = null) {
    this._loaded = true;
    this.loadError = loadError;
    if(loadError){
      console.warn("browser-control: failed to load page");
    }
  }
}
