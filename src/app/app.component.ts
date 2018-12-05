import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TransfersPage } from '../pages/transfers/transfers';
import { ItineraryPage } from '../pages/itinerary/itinerary';
import { InTransitPage } from '../pages/intransit/intransit';
import { LogoutPage } from '../pages/logout/logout';

import * as ServiceSettings from '../providers/config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              private storage: Storage) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Pick Up', component: TransfersPage },
      { title: 'My Itinerary', component: ItineraryPage },
      { title: 'In Transit', component: InTransitPage },
      { title: 'Log Out', component: LogoutPage }
    ];

    this.storage.get('user').then((u) => {
      if (u){
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    });

  }

  initializeApp() {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleLightContent();

      this.splashScreen.hide();

    });
  }

  openPage(page) {
    var maxTimeDiff = ServiceSettings.LOGIN_INTERVAL*1000*60*60;
    this.storage.get('user').then((user) => {
      var now = new Date().getTime();
      if (user.Transfer_App_Last_Login__c){
        var lastLoginTime = new Date(user.Transfer_App_Last_Login__c).getTime();
        var loginTime = now - lastLoginTime;
        if (loginTime >= maxTimeDiff){
          this.nav.setRoot(LoginPage);
        } else {
           this.nav.setRoot(page.component);
        }
      } else {
        this.nav.setRoot(LoginPage);
      }
    });
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
  }
}
