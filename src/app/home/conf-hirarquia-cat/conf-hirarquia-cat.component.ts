import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UserService } from '../../shared/user.service';


@Component({
  selector: 'app-conf-hirarquia-cat',
  templateUrl: './conf-hirarquia-cat.component.html',
  styleUrls: ['./conf-hirarquia-cat.component.scss'],
})
export class ConfHirarquiaCatComponent implements OnInit {
  public loadingSalvaDados:boolean = false;
  public dadosCat = new FormGroup({
    'alimentacao': new FormControl(null),
    'transporte': new FormControl(null),
    'lazer': new FormControl(null),
    'saude': new FormControl(null),
    'beleza': new FormControl(null),
    'imprevistos': new FormControl(null)
  });
  constructor(
    public alertController: AlertController,
    public user:UserService
    ) { }

  ngOnInit() {}

  public salvaHierarquiaCat():void{
    this.loadingSalvaDados=true;
   this.validaCampos().then(res=>{
     this.user.salvaConfigHierarquiaCategoriaDoUser(`configApp/${localStorage.getItem('UID')}/`,this.dadosCat.value)
     .then(res=>{
       this.presentAlert('OK!','Salvo','Os dados foram salvos com sucesso!');
       this.loadingSalvaDados=false;
     })
     .catch(err=>{
      this.presentAlert('OPS!','Erro!',err);
      this.loadingSalvaDados=false;
     })
   })
   .catch(err=>{
    this.loadingSalvaDados=false;
      this.presentAlert('OPS!','Campos Vazios.',`O campo ${err} é necessário!`)
    })
  }

  public validaCampos():Promise<any>{
    return new Promise((resolve,reject)=>{
      for(let key in this.dadosCat.value){
        if(this.dadosCat.value[key] === null){
          reject(key)
          break;
        }
      } 
      resolve('ok')  
    });
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
