import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ReactiveFormsModule } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';

import { HomePageRoutingModule } from './home-routing.module';
import { DividaService } from '../shared/divida.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [HomePage],
  providers: [
    DividaService,
    Network
  ]
})
export class HomePageModule {}
