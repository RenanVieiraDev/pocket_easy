import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { UserService } from '../shared/user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-topo-menu',
  templateUrl: './topo-menu.component.html',
  styleUrls: ['./topo-menu.component.scss'],
})
export class TopoMenuComponent implements OnInit {
  public menuTopoAtivo = false;
  public alertaIconOnOff;
  public user = {Nome:null,confSenha:null,email:null,senha:null,sobrenome:null,uid:null};
  constructor(
    public conf:ConfigService,
    public userSeerv:UserService,
    public alertController: AlertController,
    public menipuladorRotas:Router
    ) { }

  ngOnInit() {
    this.conf.menuAtivo.subscribe(res=>{this.menuTopoAtivo = res;});
    this.conf.onOff.subscribe(res=>{this.alertaIconOnOff = res});
    this. pegaDadosUser();
  }

  public mostraMenuLateral():void{document.querySelector('#filtroBackgroundMenuLateral').className=''}
  public escondeMenuLateral():void{document.querySelector('#filtroBackgroundMenuLateral').className='esconde'}
  public pegaDadosUser():void{
    this.userSeerv.pegaDadosDoUsuario(localStorage.getItem('UID'))
    .then(res=>{
      for(let key in res){this.user = res[key];}
    }).catch(err=>{console.log(err)});
  }

  public sair():void{
    this.userSeerv.sairDaConta().then(res=>{
      this.escondeMenuLateral();
      this.menuTopoAtivo = false;
      this.menipuladorRotas.navigate(['/login'])
    })
    .catch(err=>{})
  }

  async presentAlertFuncionalidadeEmContrucao(titulo,subTitulo,msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: subTitulo,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  public funcionalidadeEmContrucao():void{
    this.presentAlertFuncionalidadeEmContrucao('Desculpe','Em desenvolvimento.','Essa funcionalidade ainda está em faze de construção! Desculpe pelo inconveniente, aguarde que logo estará pronto.')
  }
  
  public goDashuser():void{
    this.escondeMenuLateral();
    this.menipuladorRotas.navigate(['/dashboard']);
  }
  public goConfCat():void{
    this.escondeMenuLateral();
    this.menipuladorRotas.navigate(['/confCat']);
  }
  public goHome():void{
    this.menipuladorRotas.navigate(['/home']);
  }
}
