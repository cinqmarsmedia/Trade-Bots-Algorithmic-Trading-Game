import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BrowserControlProvider } from '../../providers/browser-control/browser-control';

/**
 * Generated class for the CustomBrowserComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-browser',
  templateUrl: 'custom-browser.html'
})
export class CustomBrowserComponent implements OnDestroy, OnInit {

  text: string;
  showWebView: boolean;
  @ViewChild('webview')
  webView: ElementRef;
  showSpinner: boolean = false;

  ngOnInit(){
    this.webView.nativeElement.addEventListener('did-start-loading', ()=>{
      this.showSpinner = true;
    });
    this.webView.nativeElement.addEventListener('load-commit', ()=>{
      this.showSpinner = false;
    });
  }
  
  constructor(private browserControl: BrowserControlProvider) {
    this.browserControl.registerComponent(this);
    this.showWebView = this.browserControl.usingElectron;
  }

  ngOnDestroy(){
    this.browserControl.deregisterComponent(this);
  }

}
