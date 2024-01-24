
import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';
import {BrowserControlProvider} from '../providers/browser-control/browser-control';

@Directive({
  selector: '[openBrowser]'
})


export class OpenBrowserDirective implements AfterViewInit {

  constructor(private elRef: ElementRef,public browserControl:BrowserControlProvider) {}

ngAfterViewInit(){
if(this.elRef.nativeElement.querySelector('a')){
	this.elRef.nativeElement.querySelector('a').addEventListener('click', this.onClick.bind(this));
}

}

onClick(e){

	  e.preventDefault();
    let getSafeURL = url=> (/(http.*)/).exec(url)&&(/(http.*)/).exec(url)[0];
    console.log(getSafeURL(e.target.href)) 
	this.browserControl.initBrowser(getSafeURL(e.target.href));}
}
