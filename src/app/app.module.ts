import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Device } from '@ionic-native/device/ngx';



import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DividaService } from './shared/divida.service';
import { CrudService  } from './shared/crud.service';
import { ConfigService  } from './shared/config.service';
import { UserService } from './shared/user.service';
import { CadastroNovoUserComponent } from './user/cadastro-novo-user/cadastro-novo-user.component';
import { LoginComponent } from './user/login/login.component';
import { TopoMenuComponent } from './topo-menu/topo-menu.component';
import { AuthService } from './shared/auth.service';
import { DashuserComponent } from './home/dashuser/dashuser.component';
import { ConfHirarquiaCatComponent } from './home/conf-hirarquia-cat/conf-hirarquia-cat.component';
import { TutorialConfComponent } from './home/tutorial-conf/tutorial-conf.component';
import { SenhaResetComponent } from './user/senha-reset/senha-reset.component';




@NgModule({
  declarations: [
    AppComponent,
    CadastroNovoUserComponent,
    LoginComponent,
    TopoMenuComponent,
    DashuserComponent,
    ConfHirarquiaCatComponent,
    TutorialConfComponent,
    SenhaResetComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    DividaService,
    CrudService,
    ConfigService,
    UserService,
    AuthService,
    ScreenOrientation,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
