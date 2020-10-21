import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public dadosUser:object ={'Nome':null,'sobrenome':null,'email':null,'senha':null,'confSenha':null};

  constructor(public crud:CrudService) { }

  public validaDadosCadastroUser(dados):Promise<any>{
    return new Promise((resolve,reject)=>{
      const nomeMsg = this.confNome(dados.Nome);
      if(nomeMsg !== 'ok')reject(nomeMsg);

      const sobrenomeMsg = this.confSobrenome(dados.sobrenome);
      if(sobrenomeMsg !== 'ok')reject(sobrenomeMsg);

      const emailMsg = this.validaEmail(dados.email);
      if(emailMsg != 'ok')reject(emailMsg);

      const senhaMsg = this.validaSenha(dados.senha,dados.confSenha);
      if(senhaMsg != 'ok')reject(senhaMsg);

      resolve(this.dadosUser)
    });
  }

  public confNome(nome):string{
    if(nome !== null){nome = nome.trim(nome);};
    if(nome !== null){nome = nome.replace(/\s/g,'');};
    if(nome === null)return 'Você deve informa seu primeiro nome!';
    if(nome === '')return 'Você deve informa seu primeiro nome!';
    if(nome.length < 2)return 'Nome muito curto, informa um nome valido!';
    this.dadosUser['Nome'] = nome;
    return 'ok';
  }

  public confSobrenome(sobrenome):string{
    if(sobrenome !== null)sobrenome = sobrenome.trim();
    if(sobrenome !== null){sobrenome = sobrenome.replace(/\s/g,'');};
    if(sobrenome === null)return 'Você deve informa seu sobrenome!';
    if(sobrenome === '')return 'Você deve informa seu sobrenome!';
    if(sobrenome.length < 2)return 'sobrenome muito curto, informa um sobrenome valido!';
    this.dadosUser['sobrenome'] = sobrenome;
    return 'ok';
  }

  public validaEmail(email):string{
    if(email === '')return 'email invalido';
    if(email === null)return 'email invalido';
    let emailEmpresa = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(!emailEmpresa.test(email))return 'email invalido';
    this.dadosUser['email'] = email;
    return 'ok';
  }

  public validaSenha(senha,confSenha):string{
    if(senha !== null) senha = senha.trim();
    if(confSenha !== null) confSenha = confSenha.trim();
    if(senha === null) return 'Senha incorreta!';
    if(confSenha === null) return 'confirmação de senha é incorreta!';
    if(senha === '') return 'Senha incorreta!';
    if(confSenha === '') return 'confirmação de senha é incorreta!';
    if(senha !== confSenha) return 'a senha deve ser identica a confimrção de senha!';
    if(senha.length < 8) return 'a senha deve conter no minimo 8 caracteres';
    this.dadosUser['senha'] = senha;
    this.dadosUser['confSenha'] = confSenha;
    return 'ok';
  }

  public salvaNovoCadastro(dados):Promise<any>{
    return new Promise((resolve,reject)=>{
        this.crud.cadastraLoginEmailSenha(dados.email,dados.senha).then(res=>{
          firebase.auth().currentUser.sendEmailVerification();
          resolve(res);
        })
        .catch(err=>{
          reject(err);
        })
    });
  }

  public salvaDadosDoUserInDB(dados):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.crud.acrescentaValorNoDb(`usuarios/${dados.uid}/`,dados)
      .then(res=>{
        resolve(res)
      })
      .catch(err=>{reject(err)})
    })
  }

  public verificaAcesso(email,senha):Promise<Object>{
    return new Promise((resolve,reject)=>{
      firebase.auth().signInWithEmailAndPassword(email,senha)
      .then(res=>{
        this.setPersistenciaLogin(email,senha);
          resolve(res)
      })
      .catch(err=>{reject(err)})
    });
  }

  public setPersistenciaLogin(email,senha):void{
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(res=>firebase.auth().signInWithEmailAndPassword(email,senha))
    .catch(err=>{console.log(err)})
  }

  public pegaDadosDoUsuario(uid):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.crud.pegaValorNoDb(`usuarios/${uid}`)
      .then(res=>{resolve(res)})
      .catch(err=>{reject(err)})
    });
  }

  public sairDaConta():Promise<any>{
    return new Promise((resolve,reject)=>{
        firebase.auth().signOut()
        .then(()=>{
            localStorage.removeItem('UID');
            localStorage.removeItem('salario');
            localStorage.removeItem('localOff');
            localStorage.removeItem('firebase:host:levataxi.firebaseio.com');
            localStorage.removeItem('OTelJS.ClientId');
            localStorage.removeItem('noPristineApp');
            resolve('ok')
        })
        .catch(err=>{
          reject(err);
        })
    });
  }

  public salvaConfigHierarquiaCategoriaDoUser(path,valor):Promise<any>{
      return new Promise((resolve,reject)=>{
        this.crud.insereValorNoDb(path,valor).then(res=>{resolve(res)})
        .catch(err=>{reject(err)});
      })
  }

  public pegaConfApp(path):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.crud.pegaValorNoDb(path).then(res=>{resolve(res)})
      .catch(err=>{reject(err)});
    });
  }

  public enviarEmailParaRedefinirSenha(email):Promise<any>{
    return new Promise((resolve,reject)=>{
      firebase.auth().sendPasswordResetEmail(email)
      .then(res=>{resolve(res)})
      .catch(err=>{reject(err)})
    });
  }

}
