import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loadingEntrar:boolean = false;
  public dadosUser = new FormGroup({
    'email':new FormControl(null),
    'senha':new FormControl(null)
  });

  constructor(public user:UserService,
              public manipuladorDeRotas:Router,
              public auth:AuthService,
              public alertController: AlertController
    ) { }

  ngOnInit() {
  }

  public fazerLogin():void{
    this.loadingEntrar = true;
    this.user.verificaAcesso(this.dadosUser.value.email,this.dadosUser.value.senha)
    .then(res=>{
      if(res['user']['emailVerified']){
        localStorage.setItem('UID',res['user']['uid']);
        this.loadingEntrar = false;
        this.dadosUser.reset();
        this.manipuladorDeRotas.navigate(['/home']);
      }else{
        this.presentAlertError('OPS!','Email não confirmado!','Por favor vá ate sua caixa de email e confirme a verificação da dua conta!');
        this.loadingEntrar = false;
        this.dadosUser.reset();
      }
    })
    .catch(err=>{console.log(err)})
  }

  async presentAlertError(titulo,subTitulo,msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: subTitulo,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
