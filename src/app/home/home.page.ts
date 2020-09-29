import { Component,OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

import { DividaService } from '../shared/divida.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
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
  public conectadoAInternet:boolean;
  public alertaIconOnOff:string;

  constructor(
    public divida:DividaService,
    public alertController: AlertController,
    private network: Network
  ) {}
  
  ngOnInit(){this.startInitializationCalcs();}
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
    await this.verificaEstadoDeConexao();
    setInterval(()=>{this.verificaEstadoDeConexao();},3500);
    await this.pegaDataAtual();
    await this.verificaDadosSalvosOfflineParaSalvarEmNuvem();
  }

  public salvarDivida():void{
    this.loadingSalvar = true;
    this.dadosDivida.value.ano = this.ano;
    this.dadosDivida.value.mes = this.mes;
    this.dadosDivida.value.uidUser = localStorage.getItem('UID');
    this.divida.testaDados(this.dadosDivida.value)
    .then((res)=>{
      if(this.conectadoAInternet){
       
        this.divida.salvaDespesa(this.dadosDivida.value)
        .then(ok=>{
            this.salvaDadosOffline(this.dadosDivida.value);
            this.presentAlert('OK!','Salvo','Dados salvo com sucessu!');
            this.loadingSalvar = false;
            this.dadosDivida.reset();    
        })
        .catch(err=>{this.salvaDadosofflineDividaEmEspra();});
      }else{
        this.salvaDadosofflineDividaEmEspra();
      }
    })
    .catch(err=>{
      this.presentAlert('OPS!','Erro',err);
      this.loadingSalvar = false;
    })
  }

  public salvaDadosofflineDividaEmEspra():void{
    let despesasNoLocalStore:Array<object> = [];
    if(localStorage.getItem('despesasAguardandoConexao')){
      despesasNoLocalStore = JSON.parse(localStorage.getItem('despesasAguardandoConexao'));
      despesasNoLocalStore.push(this.dadosDivida.value);
    }else{
      despesasNoLocalStore.push(this.dadosDivida.value)
    }
    this.salvaDadosOffline(this.dadosDivida.value);
    localStorage.setItem('despesasAguardandoConexao',JSON.stringify(despesasNoLocalStore));
    this.presentAlert('OK!','Salvo','Dados salvo com sucessu!');
    this.loadingSalvar = false;
    this.dadosDivida.reset();
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

  public salvaDadosOffline(dados):void{
    let dadosOff:Array<Object> = [];
    if(localStorage.getItem('localOff')){
      dadosOff = JSON.parse(localStorage.getItem('localOff'));
      dadosOff.push(dados);  
    }else{dadosOff.push(dados);}
    localStorage.setItem('localOff',JSON.stringify(dadosOff));
  }

  public verificaDadosSalvosOfflineParaSalvarEmNuvem():void{
    let despesasNoAguardo:Array<Object> = [];
    if(localStorage.getItem('despesasAguardandoConexao')){
      despesasNoAguardo = JSON.parse(localStorage.getItem('despesasAguardandoConexao'));
     for(let key in despesasNoAguardo){
      this.salvaItemDespesaAguardada(despesasNoAguardo[key],key);
      break;
     }
    }
  }

  public salvaItemDespesaAguardada(dados,indiceDivida):void{
    let todasAsDividasEmAguardo:Array<object> = [];
     todasAsDividasEmAguardo = JSON.parse(localStorage.getItem('despesasAguardandoConexao'));
    this.divida.salvaDespesa(dados).then(ok=>{
      todasAsDividasEmAguardo.splice(indiceDivida,1);
      localStorage.setItem('despesasAguardandoConexao',JSON.stringify(todasAsDividasEmAguardo));
      if(todasAsDividasEmAguardo.length > 0){
        setTimeout(()=>{this.verificaDadosSalvosOfflineParaSalvarEmNuvem();},1000)
      }else{
        console.log('removendo dados do localstorage...')
        localStorage.removeItem('despesasAguardandoConexao');
      }
    })
    .catch(err=>{});
  }

  public verificaEstadoDeConexao():void{
    this.conectadoAInternet = navigator.onLine;
    if(this.conectadoAInternet){
      this.alertaIconOnOff = 'logoAlertOn';
    }else{
      this.alertaIconOnOff = 'logoAlertOff';
    }
  }

}
