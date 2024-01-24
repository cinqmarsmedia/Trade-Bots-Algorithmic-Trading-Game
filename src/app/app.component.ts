import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { BrowserControlProvider } from '../providers/browser-control/browser-control';

// -----------------------
  //enableProdMode();
//import { LitegraphPage } from '../pages/litegraph/litegraph';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  //rootPage:any = LitegraphPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public browserControl: BrowserControlProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

