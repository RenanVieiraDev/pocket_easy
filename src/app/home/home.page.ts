import { Component } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import { DividaService } from '../shared/divida.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  //atributos
  public ano;
  public mes;
  public dias;
  public todosOsDiasDesseMes;
  public mostraFormDespesa:boolean = false;
  public loadingSalvar:boolean = false;
  public dadosDivida =  new FormGroup({
    'dadosDia':new FormControl(null),
    'oque':new FormControl(null),
    'onde':new FormControl(null),
    'quanto':new FormControl(null),
    'como':new FormControl(null),
    'categoria':new FormControl(null),
  })
  constructor(
    public divida:DividaService,
    public alertController: AlertController
  ) {this.startInitializationCalcs();}
  
  //metodos
  public mostraFormAddGasto():void{this.mostraFormDespesa = true;}
  public escondeFormAddGsto():void{this.mostraFormDespesa = false;}
  public pegaDataAtual():void{
    this.ano = new Date().getFullYear();
    const mesFormat = (new Date().getMonth() + 1) < 10? '0'+(new Date().getMonth() + 1):(new Date().getMonth() + 1);
    this.mes = mesFormat;
    this.dias = this.retornaTotalDiasDoMes();
  }
  public retornaTotalDiasDoMes():Array<number>{
      var data = new Date(this.ano, this.mes, 0);
      let dias = []
      const totalDiasNumber = data.getDate();
      for(let x =1; x <= totalDiasNumber;x++){
        dias.push(x);
      }
       return dias;
  }
  //start inicialização
  async startInitializationCalcs(){
    await this.pegaDataAtual();
  }

  public salvarDivida():void{
    this.loadingSalvar = true;
    this.dadosDivida.value.ano = this.ano;
    this.dadosDivida.value.mes = this.mes;
    this.dadosDivida.value.uidUser = localStorage.getItem('UID');
    this.divida.testaDados(this.dadosDivida.value)
    .then((res)=>{
      this.divida.salvaDespesa(this.dadosDivida.value)
      .then(ok=>{
          this.presentAlert('OK!','Salvo','Dados salvo com sucessu!');
          this.loadingSalvar = false;
          this.dadosDivida.reset();
      })
      .catch(err=>{
        let despesasNoLocalStore:Array<object> = [];
        if(localStorage.getItem('despesas')){
          despesasNoLocalStore = JSON.parse(localStorage.getItem('despesas'));
          despesasNoLocalStore.push(this.dadosDivida.value);
        }else{
          despesasNoLocalStore.push(this.dadosDivida.value)
        }
        localStorage.setItem('despesas',JSON.stringify(despesasNoLocalStore))
        this.presentAlert('OK!','Salvo','Dados salvo com sucessu!');
        this.loadingSalvar = false;
        this.dadosDivida.reset();
      });
    })
    .catch(err=>{
      this.presentAlert('OPS!','Erro',err);
      this.loadingSalvar = false;
    })
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
