import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor() { }

  public insereValorNoDb(path:string,valor:any):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
        firebase.database().ref(`${path}`)
       .set(valor)
       .then((ok)=>{resolve('ok')})
       .catch((err)=>{reject(err)});
    });
}
public pegaValorNoDb(path:string):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
        firebase.database().ref(`${path}`)
        .once('value')
        .then((valor)=>{resolve(valor.val())})
        .catch((err)=>{reject(err)})
    });
}
public atualizaValorNoDb(path:string,valor:any):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
        firebase.database().ref(`${path}`)
        .set(valor)
        .then(()=>{resolve('update success')})
        .catch((err)=>{reject(err)})
    });
}
public deletaValorNoDb(path:string):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
        firebase.database().ref(`${path}`).remove()
        .then(()=>{resolve('removido success')})
        .catch((err)=>{reject(err)})
    });
}
public acrescentaValorNoDb(path:string,valor:any):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
        firebase.database().ref(`${path}`)
        .push(valor)
        .then((res)=>{resolve(res)})
        .catch((err)=>{reject(err)})
    });
}

public cadastraLoginEmailSenha(email,senha):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
       firebase.auth().createUserWithEmailAndPassword(email,senha)
        .then(dadosCadastroUser=>{resolve(dadosCadastroUser)})
        .catch(err=>{reject(err)})
    });
}
}
