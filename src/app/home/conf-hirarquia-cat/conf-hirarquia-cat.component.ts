import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UserService } from '../../shared/user.service';
import { DividaService }from '../../shared/divida.service';
import { ConfigService } from '../../shared/config.service';


@Component({
  selector: 'app-conf-hirarquia-cat',
  templateUrl: './conf-hirarquia-cat.component.html',
  styleUrls: ['./conf-hirarquia-cat.component.scss'],
})
export class ConfHirarquiaCatComponent implements OnInit {
  public loadingSalvaDados:boolean = false;
  public itenDividaEmZooAtual:Object;
  public mostrarDividaEmZoon:boolean = false;
  public itenDividaEmEdicao:Object;
  public mostrarDividaEmEdicao:boolean = false;
  public dataETotalDias:object;
  public loadingEdicaoDivida:boolean = false;
  public dadosCat = new FormGroup({
    'alimentacao': new FormControl(null),
    'transporte': new FormControl(null),
    'lazer': new FormControl(null),
    'saude': new FormControl(null),
    'beleza': new FormControl(null),
    'imprevistos': new FormControl(null)
  });
  public dividasFixas:Array<object> = []
  constructor(
    public alertController: AlertController,
    public user:UserService,
    public divida:DividaService,
    public conf:ConfigService
    ) { }

  ngOnInit() {
    this.pegaDividasFixas();
    this.dataETotalDias = this.conf.pegaDataAtual();
  }

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

  public pegaDividasFixas():void{
    this.dividasFixas = [];
    this.divida.pegaListaDeDividas(`dividas/${localStorage.getItem('UID')}/`)
    .then(res=>{
      for(let key in res){
        if(res[key]['categoria'] === 'fixo'){
          res[key].uidDivida = key;
          this.dividasFixas.push(res[key])
        }
      }
    })
    .catch(err=>{
      this.presentAlert('OPS!','erro.',err);
    })
  }

  public trougleZoonViewDivida(item):void{
    this.mostrarDividaEmZoon = this.mostrarDividaEmZoon === false?true:false;
    this.itenDividaEmZooAtual = item;
  }

  public editDivida(item):void{
    this.mostrarDividaEmEdicao = this.mostrarDividaEmEdicao === false?true:false;
    this.itenDividaEmEdicao = item;
  }

  public salvarModificacao():void{
    this.loadingEdicaoDivida = true;
    this.montaOsDadosNovosParaEditar();
  }

  public montaOsDadosNovosParaEditar():void{
   const oqueInput = document.querySelector('#oque')['value'];
   const ondeInput = document.querySelector('#onde')['value'];
   const quantoInput = document.querySelector('#quanto')['value'];
   const comoInput = document.querySelector('#como')['value'];
   const diaInput = document.querySelector('#dia')['value'];
   const mesInput = document.querySelector('#mes')['value'];
   const anoInput = document.querySelector('#ano')['value'];
   let dadosModificacao = {
     oque:oqueInput,
     onde:ondeInput,
     quanto:parseFloat(quantoInput),
     como:comoInput,
     dadosDia:diaInput,
     mes:mesInput,
     ano:anoInput,
     categoria:this.itenDividaEmEdicao['categoria'],
     uidUser:this.itenDividaEmEdicao['uidUser'],
     uidDivida:this.itenDividaEmEdicao['uidDivida']
    }
    this.divida.testaDados(dadosModificacao)
    .then(res=>{
      this.salvaAlteraçõesEmDividasFixas(dadosModificacao);
    })
    .catch(err=>{
      this.loadingEdicaoDivida = false;
      this.presentAlert('OPS!','erro.',err);
    })
  }

  public salvaAlteraçõesEmDividasFixas(dados):void{
    this.divida.alteraDadosDespesa(dados,dados['uidDivida'])
    .then(res=>{
      this.loadingEdicaoDivida = false;
      this.editDivida({});
      this.pegaDividasFixas();
    })
    .catch(err=>{
      this.loadingEdicaoDivida = false;
      this.presentAlert('OPS!','erro.',err);
    })
  }

}
