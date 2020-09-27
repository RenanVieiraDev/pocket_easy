import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public firebaseConfig = {
    apiKey: "AIzaSyCCd3LNoirKgH5Jfq1lVm_Z2vH5akHcBKU",
    authDomain: "sllim-b785c.firebaseapp.com",
    databaseURL: "https://sllim-b785c.firebaseio.com",
    projectId: "sllim-b785c",
    storageBucket: "sllim-b785c.appspot.com",
    messagingSenderId: "518452779431",
    appId: "1:518452779431:web:d8de25ed3c8ea0111e7e82",
    measurementId: "G-QV6Z1MQX7X"
  };
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    firebase.initializeApp(this.firebaseConfig);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
