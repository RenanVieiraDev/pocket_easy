import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReactiveFormsModule } from '@angular/forms';

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



@NgModule({
  declarations: [
    AppComponent,
    CadastroNovoUserComponent,
    LoginComponent,
    TopoMenuComponent,
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
