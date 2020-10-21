import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from '../../shared/user.service';
import { DividaService } from '../../shared/divida.service';


@Component({
  selector: 'app-tutorial-conf',
  templateUrl: './tutorial-conf.component.html',
  styleUrls: ['./tutorial-conf.component.scss'],
})
export class TutorialConfComponent implements OnInit {
  public listaDeDividas = [];
  public btnTrougleListMostrar = false; 
  public ano;
  public mes;
  public dias;
  public todosOsDiasDesseMes;
  public loadingSalvaDados = false;
  public tela:number = 0;
  public dadosCat = new FormGroup({
    'alimentacao': new FormControl(null),
    'transporte': new FormControl(null),
    'lazer': new FormControl(null),
    'saude': new FormControl(null),
    'beleza': new FormControl(null),
    'imprevistos': new FormControl(null)
  });
  public dadosSalario = new FormGroup({'salario':new FormControl(null)});
  public dadosDivida =  new FormGroup({
    'dadosDia':new FormControl(null),
    'oque':new FormControl(null),
    'onde':new FormControl(null),
    'quanto':new FormControl(null),
    'como':new FormControl(null),
    'categoria':new FormControl(null),
  });

  constructor(
    public confApp:ConfigService,
    public alertController: AlertController,
    public user:UserService,
    public divida:DividaService,
    public manipuladorDeRotas:Router
  ) { 
    this.confApp.mostrarMenu(false);
  }

  ngOnInit() {
    this.pegaDataAtual();
  }

  public mudaTela(numeroTela):void{this.tela = numeroTela;}

  public salvaHierarquiaCat():void{
    this.loadingSalvaDados=true;
   this.validaCampos().then(res=>{
     this.user.salvaConfigHierarquiaCategoriaDoUser(`configApp/${localStorage.getItem('UID')}/`,this.dadosCat.value)
     .then(res=>{
       this.mudaTela(2)
       this.loadingSalvaDados=false;
     })
     .catch(err=>{
      this.presentAlert('OPS!','Erro!',err);
      this.loadingSalvaDados=false;
     })
   })
   .catch(err=>{
    this.loadingSalvaDados=false;
      this.presentAlert('OPS!!','Campos Vazios',`O campo ${err} é necessario para configurar o app!`)
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


  public salvarSalario():void{
    this.loadingSalvaDados = true;
    let testeValor = this.validaValorSalario(this.dadosSalario.value.salario);
    if(testeValor !== 'ok'){
      console.log(testeValor);
      this.loadingSalvaDados = true;
    }else{
      this.confApp.salvarSalario(`salario/${localStorage.getItem('UID')}/`,this.dadosSalario.value.salario)
      .then(res=>{
        this.loadingSalvaDados = false;
        localStorage.setItem('salario',this.dadosSalario.value.salario);
        this.dadosSalario.reset();
        this.mudaTela(3)
      })
      .catch(err=>{
        this.loadingSalvaDados = true;
        console.log(err)
      })
    }
  }

  public validaValorSalario(valor):string{
    if(valor !== null)valor = parseFloat(valor);
    if(valor === null)return 'Valor invalido!';
    if(valor === '')return 'Valor invalido!';
    if(valor <= 0)return 'O valor do salario deve ser maior que 0';
    return 'ok';
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

public pegaDataAtual():void{
  this.ano = new Date().getFullYear();
  const mesFormat = (new Date().getMonth() + 1) < 10? '0'+(new Date().getMonth() + 1):(new Date().getMonth() + 1);
  this.mes = mesFormat;
  this.dias = this.retornaTotalDiasDoMes();
}

public salvarDivida():void{
  this.dadosDivida.value.ano = this.ano;
  this.dadosDivida.value.mes = this.mes;
  this.dadosDivida.value.uidUser = localStorage.getItem('UID');
  this.dadosDivida.value.categoria = 'fixo';
  this.divida.testaDados(this.dadosDivida.value)
  .then((res)=>{
      this.divida.salvaDespesa(this.dadosDivida.value)
      .then(ok=>{
          this.presentAlert('OK!','Salvo','Dados salvo com sucessu!');
          this.dadosDivida.reset();
          this.pegaListaDividas();   
      })
      .catch(err=>{
        this.presentAlert('OPS!','Não foi possivel salvar os dados!',err);
      });
  })
  .catch(err=>{
    this.presentAlert('OPS!','Erro',err);
  })
}

mostraMenuDeListaDividas():void{
  const container = document.querySelector('#containerDivida');
  container.className = 'divMenuListaDividasVisivel';
  this.btnTrougleListMostrar = true;
}
escondeMenuDeListaDividas():void{
  const container = document.querySelector('#containerDivida');
  container.className = 'divMenuListaDividasEscondido';
  this.btnTrougleListMostrar = false;
}


public pegaListaDividas():void{
  this.listaDeDividas = [];
    this.divida.pegaListaDeDividas(`dividas/${localStorage.getItem('UID')}/`)
    .then(res=>{
      for(let key1 in res){
        res[key1].id_divida = key1;
        this.listaDeDividas.push(res[key1]);
      }
    })
    .catch(err=>{
      this.presentAlert('OPS!','ERRO',err)
    })
}

public finalizarConfgApp():void{
  if(this.listaDeDividas.length > 0){
    localStorage.setItem('noPristineApp','false');
    this.confApp.autorizacaoInitAppTotor();
    this.manipuladorDeRotas.navigate(['/'])
  }else{
    this.presentAlert('OPS!','Insira divida.','para terminar as configurações do seu app, inclua pelo menos uma divida fixa');
  }
}

}
