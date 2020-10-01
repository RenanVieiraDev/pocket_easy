import { Injectable, EventEmitter } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public mudaSalario = new EventEmitter();

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

}
