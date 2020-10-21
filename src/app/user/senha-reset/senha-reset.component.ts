import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-senha-reset',
  templateUrl: './senha-reset.component.html',
  styleUrls: ['./senha-reset.component.scss'],
})
export class SenhaResetComponent implements OnInit {
  
  public emailUser = new FormGroup({'email':new FormControl(null)});
  public loadingEntrar:boolean = false;
  public confirmacaoEnvioEmail:number = 0;
  public confEmailView:string = '';

  constructor(
    public user:UserService,
    public alertController: AlertController
  ) { }

  ngOnInit() {}

  async enviarEmail(){
    this.loadingEntrar = true;
    let testeValidadeEmail = this.user.validaEmail(this.emailUser.value.email);
    if(testeValidadeEmail != 'ok'){
      this.presentAlert('OPS!','Erro',testeValidadeEmail);
      this.loadingEntrar = false;
    }else if(testeValidadeEmail === 'ok'){
      this.user.enviarEmailParaRedefinirSenha(this.emailUser.value.email)
      .then(res=>{
        this.loadingEntrar = false;
        this.confEmailView = this.emailUser.value.email;
        this.emailUser.reset();
        this.confirmacaoEnvioEmail = 1;
      })
      .catch(err=>{
        this.loadingEntrar = false;
        this.presentAlert('OPS!','Erro','Não há registro de usuário correspondente a este email.');
      })
    }
  }

  async presentAlert(titulo,subTitulo,msg) {
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
