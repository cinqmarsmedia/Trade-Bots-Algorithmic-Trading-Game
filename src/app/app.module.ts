import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TooltipsModule } from 'ionic-tooltips';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
//import { ColorPickerModule } from 'angular2-color-picker';

import { BrowserControlProvider } from "../providers/browser-control/browser-control";
import { CustomBrowserComponent } from "../components/custom-browser/custom-browser";
import { WebviewDirective } from "../directives/webview/webview";
//import { CustomBrowserComponent } from "../components/custom-browser/custom-browser";
import { sanHtmlPipe } from '../safe-html.pipe';
//import { NgApexchartsModule } from 'ng-apexcharts';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from "@ionic/storage";

//import { DragulaModule, DragulaService } from 'ng2-dragula';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { disclaimerModal } from '../pages/home/modals';
import { missionsModal } from '../pages/home/modals';
import { extrasModal } from '../pages/home/modals';
import { upgradesModal } from '../pages/home/modals';
import { idleModal } from '../pages/home/modals';
import { tutorialModal } from '../pages/home/modals';
import { helpModal } from '../pages/home/modals';
import { quizModal } from '../pages/home/modals';
import { learnModal } from '../pages/home/modals';
import { loanModal } from '../pages/home/modals';
import { statsModal } from '../pages/home/modals';
import { customDataModal } from '../pages/home/modals';
import { logsModal } from '../pages/home/modals';
import { histModal } from '../pages/home/modals';
import { podcastsModal } from '../pages/home/modals';
//import { logsModal } from '../pages/baklava/baklava';
import { portModal } from '../pages/baklava/baklava';
import { neuralModal } from '../pages/baklava/baklava';

import { maModal } from '../pages/home/modals';
import { trendModal } from '../pages/home/modals';
import { indicatorModal } from '../pages/home/modals';
import { simpleBotModal } from '../pages/home/modals';
//import { LitegraphPage } from '../pages/litegraph/litegraph';
import { BaklavaPage } from '../pages/baklava/baklava';
import { ChartsProvider } from '../providers/charts/charts';

import { EscapeHtmlPipe } from '../keep-html.pipe';

import { ThousandSuffixesPipe } from '../thousands';
import { NodesProvider } from '../providers/nodes/nodes';
import { StateMachine } from '../providers/state-machine/state-machine';

//from https://stackoverflow.com/a/42786124
import { Injector } from '@angular/core';
import { BaklavaProvider } from '../providers/baklava/baklava';
export let AppInjector: Injector;
import {enableProdMode} from '@angular/core';
import { Simulator } from '../providers/simulator/simulator';

enableProdMode();


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    upgradesModal,
    tutorialModal,
    helpModal,
    idleModal,
    quizModal,
    sanHtmlPipe,
    disclaimerModal,
    extrasModal,
    portModal,
    neuralModal,
    missionsModal,
    statsModal,
    customDataModal,
    logsModal,
    histModal,
    learnModal,
    indicatorModal,
    simpleBotModal,
    podcastsModal,
    maModal,
    trendModal,
    loanModal,
    BaklavaPage,
    EscapeHtmlPipe,
    ThousandSuffixesPipe,
    CustomBrowserComponent,
    WebviewDirective
  ],
  imports: [
    //ColorPickerModule, everything goes crazy
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TooltipsModule.forRoot(),
    DragulaModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    logsModal,
    histModal,
    idleModal,
    portModal,
    disclaimerModal,
    extrasModal,
    neuralModal,
    missionsModal,
    statsModal,
    customDataModal,
    learnModal,
    indicatorModal,
    simpleBotModal,
    podcastsModal,
    maModal,
    trendModal,
    loanModal,
    upgradesModal,
    tutorialModal,
    helpModal,
    quizModal,
    //LitegraphPage,
    BaklavaPage
  ],
  providers: [
    StatusBar,
    Simulator,

    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ChartsProvider,
    NodesProvider,
    StateMachine,
    BrowserControlProvider,
    BaklavaProvider,
  ]
})
export class AppModule {
  constructor(private injector: Injector) {
    //from https://stackoverflow.com/a/42786124
    AppInjector = this.injector;
  }
}
