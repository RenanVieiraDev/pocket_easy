import { Component,OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DividaService } from '../shared/divida.service';
import { ConfigService } from '../shared/config.service'

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
  public listaDeDividas:Array<object> = [];
  public loadingItens:boolean = true;
  public verDividaZoon:Object;
  public salarioMes:any = 0;
  public totalDividas:any = 0;
  public restoSalario:any = 0;

  constructor(
    public divida:DividaService,
    public alertController: AlertController,
    public config:ConfigService
  ) {}
  
  ngOnInit(){
    this.config.mudaSalario.subscribe(async res=>{
     this.salarioMes = res;
     await this.calculaValorTotalDividas();
     await this.calculaValorRestoSalarioInDividas();
    });
    this.startInitializationCalcs();
  }
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
    if(localStorage.getItem('dividasExcluirEmAguardo') && this.conectadoAInternet){
     await this.verificaDadosSalvosOfflineParaExcluirEmNuvem();
    }else{
      await this.pegaListaDividas();
    }
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
        this.pegaListaDividas();
      }else{
        this.salvaDadosofflineDividaEmEspra();
        this.pegaListaDividas();
      }
    })
    .catch(err=>{
      this.presentAlert('OPS!','Erro',err);
      this.loadingSalvar = false;
    })
  }

  public salvaDadosofflineDividaEmEspra():void{
    this.dadosDivida.value.idOffline = this.divida.geraIdDividaOffline(this.listaDeDividas);
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
    }else{
      dadosOff.push(dados);
    }
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

  public verificaDadosSalvosOfflineParaExcluirEmNuvem():void{
    let despesasNoAguardo:Array<Object> = [];
    if(localStorage.getItem('dividasExcluirEmAguardo')){
      despesasNoAguardo = JSON.parse(localStorage.getItem('dividasExcluirEmAguardo'));
     for(let key in despesasNoAguardo){
      this.excluiItemDespesaAguardada(despesasNoAguardo[key],key);
      break;
     }
    }
  }

  public excluiItemDespesaAguardada(dados,indiceDivida):void{
    let todasAsDividasEmAguardo:Array<object> = [];
     todasAsDividasEmAguardo = JSON.parse(localStorage.getItem('dividasExcluirEmAguardo'));
    this.divida.apagaDivida('dividas',localStorage.getItem('UID'),dados.id_divida).then(ok=>{
      todasAsDividasEmAguardo.splice(indiceDivida,1);
      localStorage.setItem('dividasExcluirEmAguardo',JSON.stringify(todasAsDividasEmAguardo));
      if(todasAsDividasEmAguardo.length > 0){
        setTimeout(()=>{this.verificaDadosSalvosOfflineParaExcluirEmNuvem();},500)
      }else{
        localStorage.removeItem('dividasExcluirEmAguardo');
        this.pegaListaDividas();
      }
    })
    .catch(err=>{});
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
        localStorage.removeItem('despesasAguardandoConexao');
      }
    })
    .catch(err=>{});
  }

  public salvaItensParaExcluirEmAguardo(divida):void{
    if(divida.id_divida){
      let todasAsDividasExcluirEmAguardo:Array<object> = [];
      if(localStorage.getItem('dividasExcluirEmAguardo')){
        todasAsDividasExcluirEmAguardo = JSON.parse(localStorage.getItem('dividasExcluirEmAguardo'));     
      }
      todasAsDividasExcluirEmAguardo.push(divida);
      localStorage.setItem('dividasExcluirEmAguardo',JSON.stringify(todasAsDividasExcluirEmAguardo));
    }
  }

  public excluiItensInLocalOff(divida):void{
    let dividasEmLocalOff:Array<object> = [];
    if(localStorage.getItem('localOff')){
      dividasEmLocalOff = JSON.parse(localStorage.getItem('localOff'));
    }
    for(let key in dividasEmLocalOff){
      if(divida.id_divida){
        console.log('aki id_divida');
        if(dividasEmLocalOff[key]['id_divida'] === divida.id_divida){dividasEmLocalOff.splice(parseInt(key),1);}
      }else{
        console.log('aki idOffline');
        if(dividasEmLocalOff[key]['idOffline'] === divida.idOffline){dividasEmLocalOff.splice(parseInt(key),1);}
      }
    }
    if(dividasEmLocalOff.length === 0){
      localStorage.removeItem('localOff');
    }else{
      localStorage.setItem('localOff',JSON.stringify(dividasEmLocalOff));
    }
    
  }

  public excluiItensInDividasEmAguardo(divida):void{
    let dividasEmLocalAguardo:Array<object> = [];
    if(localStorage.getItem('despesasAguardandoConexao')){
      dividasEmLocalAguardo = JSON.parse(localStorage.getItem('despesasAguardandoConexao'));
    }
    for(let key in dividasEmLocalAguardo){
      if(dividasEmLocalAguardo[key]['idOffline'] === divida.idOffline){
        dividasEmLocalAguardo.splice(parseInt(key),1);
      }
    }
    if(dividasEmLocalAguardo.length === 0){
      localStorage.removeItem('despesasAguardandoConexao');
    }else{
      localStorage.setItem('despesasAguardandoConexao',JSON.stringify(dividasEmLocalAguardo));
    }
      
  }

  public verificaEstadoDeConexao():void{
    this.conectadoAInternet = navigator.onLine;
    if(this.conectadoAInternet){
      this.config.sistemaOnOff('logoAlertOn');
    }else{
      this.config.sistemaOnOff('logoAlertOff');
    }
  }

  public pegaListaDividas():void{
    this.listaDeDividas = [];
    this.loadingItens = true;
    if(this.conectadoAInternet){
      this.divida.pegaListaDeDividas(`dividas/${localStorage.getItem('UID')}/`)
      .then(res=>{
        for(let key1 in res){
          res[key1].id_divida = key1;
          this.listaDeDividas.push(res[key1]);
        }
        localStorage.setItem('localOff',JSON.stringify(this.listaDeDividas))
        this.loadingItens = false;
        this.pegaValorSalario().then(res=>{
          this.calculaValorTotalDividas();
          this.calculaValorRestoSalarioInDividas();
        }).catch((err)=>{})
      })
      .catch(err=>{
        this.presentAlert('OPS!','ERRO',err)
        this.loadingItens = false;
      })
    }else{
      if(localStorage.getItem('localOff')){this.listaDeDividas = JSON.parse(localStorage.getItem('localOff'))}
      this.loadingItens = false;
      this.pegaValorSalario().then(res=>{
        this.calculaValorTotalDividas();
        this.calculaValorRestoSalarioInDividas();
      }).catch((err)=>{})
    }
  }

  async presentAlertConfirmDelDivida(divida) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deletar?',
      message: `Você deseja realmente deletar esse lançamento?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Apagar',
          handler: () => {
            this.deletarDivida(divida);
          }
        }
      ]
    });

    await alert.present();
  }
  
  public DividaZoon(divida):void{this.verDividaZoon = divida;}
  public escondeDividaZoon():void{this.verDividaZoon = null}
  public deletarDivida(divida):void{
    if(this.conectadoAInternet){
      this.divida.apagaDivida('dividas',localStorage.getItem('UID'),divida.id_divida).then(res=>{this.pegaListaDividas()}).catch(err=>{this.presentAlert('OPS!','ERRO',err)});
    }else{
      this.salvaItensParaExcluirEmAguardo(divida);
      this.excluiItensInLocalOff(divida);
      this.excluiItensInDividasEmAguardo(divida);
      this.pegaListaDividas();
    }
  }

  public monstrarConfigValorSalario():void{
    document.querySelector('#menuConfSalario').className = ''
  }
  public escondeConfigValorSalario():void{
    document.querySelector('#menuConfSalario').className = 'esconde'
  }

  public calculaValorTotalDividas():void{
    let valor = 0;
    for(let key in this.listaDeDividas){valor += this.listaDeDividas[key]['quanto'];}
    this.totalDividas = valor;
  }

  public calculaValorRestoSalarioInDividas():void{
    let valorDividasTot = 0;
    for(let key in this.listaDeDividas){valorDividasTot += this.listaDeDividas[key]['quanto'];}
    this.restoSalario = this.salarioMes - valorDividasTot;
  }

  public pegaValorSalario():Promise<any>{
    return new Promise((resolve,reject)=>{
      if(this.conectadoAInternet){
        this.config.pegaSalarioInDB(`salario/${localStorage.getItem('UID')}`)
        .then(res=>{
          this.salarioMes = res
          resolve(res);
        })
        .catch(err=>{
          console.log(err)
          reject(err)
        })
      }else{
        if(localStorage.getItem('salario')){
          this.salarioMes = parseFloat(localStorage.getItem('salario'));
          resolve(this.salarioMes);
        }else{
          reject('error')
        }
      }
    });
  }
}
