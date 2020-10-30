import { Component, OnInit } from '@angular/core';
import { DividaService } from '../../shared/divida.service';
import { UserService } from '../../shared/user.service';
import { ConfigService } from '../../shared/config.service';

@Component({
  selector: 'app-dashuser',
  templateUrl: './dashuser.component.html',
  styleUrls: ['./dashuser.component.scss'],
})
export class DashuserComponent implements OnInit {
  public dividasPorCategorias:any = new Array();
  public categoriasValoresTotal:Array<object> = [];
  public configPorcentoApp;
  public categoriasMaximoValorGastoETotalGasto:Array<object> = [];
  public naoADados:boolean = false;
  public modoOffAtivo:boolean = false;

  constructor(
    public divida:DividaService,
    public user:UserService,
    public conf:ConfigService
  ) {
      if(this.conf.verificaDispositivoComConexaoAbertaInternet()){
        this.pegaConfigPorcentoApp();
        this.pegaDividasParaSepararPorCategoria();
      }else{
        this.modoOffAtivo = true;
        console.log('dispositivo OFFline');
      } 
  }

  async ngOnInit() {}

  public pegaDividasParaSepararPorCategoria():void{
    this.divida.pegaListaDeDividas(`dividas/${localStorage.getItem('UID')}`)
    .then(async res=>{
      if(res === null){this.naoADados = true}
      let categoriasExistentes = []
      for(let key1 in res){
        if(categoriasExistentes.indexOf(res[key1].categoria) === -1){
          categoriasExistentes.push(res[key1].categoria);
        }
      }
      for(let key2 in res){
        if(this.dividasPorCategorias[categoriasExistentes.indexOf(res[key2].categoria)] === undefined){
          this.dividasPorCategorias[categoriasExistentes.indexOf(res[key2].categoria)] = [];
        }
        this.dividasPorCategorias[categoriasExistentes.indexOf(res[key2].categoria)].push(res[key2])
      }
      await this.calculaValorTotalDeCadaCategoria();
      await this.calculaPorcentagemConsumidaPorCategoria();
    })
    .catch(err=>{console.log(err)})
  }

  public calculaValorTotalDeCadaCategoria():void{
    this.categoriasValoresTotal = [];
    for(let key1 in this.dividasPorCategorias){
      let calculo:number = 0;
      let categoriaAtual:string = ''
      for(let key2 in this.dividasPorCategorias[key1]){
        categoriaAtual = this.dividasPorCategorias[key1][key2].categoria;
        calculo += this.dividasPorCategorias[key1][key2].quanto;
      }
      this.categoriasValoresTotal.push({categoria:categoriaAtual,valorTotal:calculo});
    }
  }

  public pegaConfigPorcentoApp():void{
    this.user.pegaConfApp(`configApp/${localStorage.getItem('UID')}`)
    .then(res=>{this.configPorcentoApp = res})
    .catch(err=>{console.log(err)})
  }

  public calculaPorcentagemConsumidaPorCategoria():void{
    let valorTotal = 0;
    for(let key in this.categoriasValoresTotal){
      if(this.categoriasValoresTotal[key]['categoria'] === 'fixo'){
        valorTotal += this.categoriasValoresTotal[key]['valorTotal']
      }
    }
    let restoDosalario = parseFloat(localStorage.getItem('salario'))-valorTotal
    this.categoriasMaximoValorGastoETotalGasto = [];
    for (let key in this.categoriasValoresTotal){
      if(this.categoriasValoresTotal[key]['categoria'] !== 'fixo'){
        let indiceCat = (this.categoriasValoresTotal[key]['categoria']).toLowerCase()
        let valorMaximoCatAtual = (restoDosalario * this.configPorcentoApp[indiceCat])/100;
        let porcentagemUtilizada = (this.categoriasValoresTotal[key]['valorTotal']/valorMaximoCatAtual)*100;
        let testeEdicaoInView = parseFloat(porcentagemUtilizada.toFixed(0));
        let porcentoParaView;
        if(testeEdicaoInView < 10){
          porcentoParaView = `0.0${porcentagemUtilizada.toFixed(0)}`;
        }else if(testeEdicaoInView >= 10 && testeEdicaoInView < 100){
          porcentoParaView = `0.${porcentagemUtilizada.toFixed(0)}`;
        }else if(testeEdicaoInView >= 100){
          porcentoParaView = porcentagemUtilizada.toFixed(0)
        }
        let alerta = '';
        if(parseFloat(porcentagemUtilizada.toFixed(0)) < 50){
          alerta = 'alertaPorcentagemNomal';
        }else if(parseFloat(porcentagemUtilizada.toFixed(0)) >= 50 && parseFloat(porcentagemUtilizada.toFixed(0)) < 80){
          alerta = 'alertaPorcentagemMedio';
        }else if(parseFloat(porcentagemUtilizada.toFixed(0)) >= 80){
          alerta = 'alertaPorcentagemGrave';
        }
        this.categoriasMaximoValorGastoETotalGasto.push({
          nomeCategoria:this.mudaValorLetrasApresebtacao(indiceCat),
          valorLimite:valorMaximoCatAtual,
          valorGasto:this.categoriasValoresTotal[key]['valorTotal'],
          porcentagemUtilizada:porcentagemUtilizada,
          porcentoParaview:porcentoParaView,
          porcentagemApresentacaoArredondada:parseFloat(porcentagemUtilizada.toFixed(0)),
          alerta:alerta
        })
      }
    }
  }

  public mudaValorLetrasApresebtacao(valor):String{
    if(valor === 'alimentacao'){
      return 'Alimentação';
    }else if(valor === 'beleza'){
      return 'Beleza';
    }else if(valor ==='imprevistos'){
      return 'Imprevistos';
    }else if(valor === 'saude'){
      return 'Saúde';
    }else if(valor === 'lazer'){
      return 'Lazer';
    }else if(valor === 'transporte'){
      return 'Transporte';
    }
  }
}
