import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import * as firebase from 'firebase';
import { ConfigService } from './shared/config.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Device } from '@ionic-native/device/ngx';

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
    private statusBar: StatusBar,
    public conf:ConfigService,
    private screenOrientation: ScreenOrientation,
    private device: Device
  ) {
    this.orioentationScreenMobile();
    firebase.initializeApp(this.firebaseConfig);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async orioentationScreenMobile(){
    if(this.platform.is('android')){
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    }else if(this.platform.is('ios')){
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    }
  }



}
