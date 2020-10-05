import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { Router }from '@angular/router';

@Component({
  selector: 'app-cadastro-novo-user',
  templateUrl: './cadastro-novo-user.component.html',
  styleUrls: ['./cadastro-novo-user.component.scss'],
})
export class CadastroNovoUserComponent implements OnInit {

  public loadingSalvarCadastro:boolean = false;
  public dadosUser = new FormGroup({
    'Nome':new FormControl(null),
    'sobrenome':new FormControl(null),
    'email':new FormControl(null),
    'senha':new FormControl(null),
    'confSenha':new FormControl(null)
  });

  constructor(
    public user:UserService,
    public alertController: AlertController,
    public manipuladorDeRotas:Router
  ) { }

  ngOnInit() {}

  public validaDados():void{
   this.loadingSalvarCadastro = true;
   this.user.validaDadosCadastroUser(this.dadosUser.value)
   .then(res=>{this.cadastraNovoUser(res);})
   .catch(err=>{
    this.presentAlertError('OPS!','Erro em campos',err);
     this.loadingSalvarCadastro = false;
   })
  }

  public cadastraNovoUser(dados):void{
    this.user.salvaNovoCadastro(dados).then(res=>{
      dados.uid = res.user.uid;
      this.user.salvaDadosDoUserInDB(dados).then(res=>{
        this.dadosUser.reset();
        this.loadingSalvarCadastro = false;
        this.presentAlertConfirmGoLogin('Ok! seu cadastro foi realizado!', 'te enviamos um email para você confirmar, para poder acessar sua conta')
      }).catch(err=>{this.presentAlertError('OPS!','Erro ao salvar dados!',err)});
    }).catch(err=>{this.presentAlertError('OPS!','Erro ao realizar cadastro!',err)});
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

  async presentAlertConfirmGoLogin(Titulo, msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: Titulo,
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'OK',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, 
        {
          text: 'Login',
          handler: () => {
            this.manipuladorDeRotas.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }


}
