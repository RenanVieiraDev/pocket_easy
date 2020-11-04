import { Injectable, EventEmitter } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public mudaSalario = new EventEmitter();
  public menuAtivo = new EventEmitter();
  public onOff = new EventEmitter();
  public appAutorizedInitTutorial = new EventEmitter();
  public ano;
  public mes;
  public dias;


  constructor(public crud:CrudService) { }


  public salvarSalario(path,valorSalario):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.crud.insereValorNoDb(path,valorSalario)
      .then(res=>{
        this.mudaSalario.emit(valorSalario);
        resolve(res);
      })
      .catch(err=>{reject(err)})
    });
  }

  public pegaSalarioInDB(path):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
      this.crud.pegaValorNoDb(path).then(res=>{resolve(res)}).catch(err=>{reject(err)});
    });
  }

  public mostrarMenu(valor:boolean):void{this.menuAtivo.emit(valor);}
  public sistemaOnOff(valor:string):void{this.onOff.emit(valor);}
  public autorizacaoInitAppTotor():void{this.appAutorizedInitTutorial.emit(true)}
  public verificaDispositivoComConexaoAbertaInternet():boolean{return navigator.onLine;}

  public pegaDataAtual():Object{
    this.ano = new Date().getFullYear();
    const mesFormat = (new Date().getMonth() + 1) < 10? '0'+(new Date().getMonth() + 1):(new Date().getMonth() + 1);
    this.mes = mesFormat;
    this.dias = this.retornaTotalDiasDoMes();
    return {
      ano:this.ano,
      mes:this.mes,
      dias:this.dias
    }
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

}
