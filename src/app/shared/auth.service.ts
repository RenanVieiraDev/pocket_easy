import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(
    public conf:ConfigService,
    public manipuladorRotas:Router
    ) { }
  
  async canActivate(){
    this.conf.mostrarMenu(true);
    return true
    //return await this.checkLogin();
  }

  public checkLogin():Promise<boolean>{
    return new Promise((resolve,reject)=>{
      firebase.auth().onAuthStateChanged(res=>{
        if(res !== null){
         if(!res.emailVerified){ //se a confirmação do email não foi confirmada pelo o usuario manda ele pro login;
            this.manipuladorRotas.navigate(['/login']);
            resolve(false);
          }else if(localStorage.getItem('UID') !== res.uid){ //caso o UID armazenado no localstorage for diferente do uid do sdk do firebase, manda usuario pro login;
            this.manipuladorRotas.navigate(['/login']);
            resolve(false);
          }else if(localStorage.getItem('UID') === res.uid){
            this.conf.mostrarMenu(true);
            resolve(true);
          }
        }else{
          this.manipuladorRotas.navigate(['/login'])
          resolve(false);
        }
      })
    });
  }
  
}
