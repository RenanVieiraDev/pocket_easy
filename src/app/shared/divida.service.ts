import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class DividaService {

  constructor(public crud:CrudService) { }

  public testaDados(dados):Promise<any>{
    return new Promise((resolve,reject)=>{
      let dia = this.validaDia(dados.dadosDia);
      if(dia !== 'ok')reject(dia);
      
      let mes = this.validaMes(dados.mes);
      if(mes !== 'ok')reject(mes);
      
      let ano = this.validaAno(dados.ano);
      if(ano !== 'ok')reject(ano);

      let oque = this.validaOque(dados.oque);
      if(oque !== 'ok')reject(oque);

      let onde = this.validaOnde(dados.onde);
      if(onde !== 'ok')reject(onde);

      let quanto = this.validaQuanto(dados.quanto);
      if(quanto !== 'ok')reject(quanto);

      let como = this.validaComo(dados.como);
      if(como !== 'ok')reject(como);

      let categoria = this.validaCategoria(dados.categoria);
      if(categoria !== 'ok')reject(categoria);
      resolve('ok')
    });
  }


  public validaDia(dados):string{
    if(dados !== null)dados = parseInt(dados)
    if(dados === null)return 'Por favor, informa o dia da dívida!';
    if(dados <= 0)return 'Valor referente ao dia está incorreto!';
    return'ok'
  };

  public validaMes(dados):string{
    if(dados !== null)dados = parseInt(dados)
    if(dados === null)return 'Por favor, informa o mês da dívida!';
    if(dados <= 0)return 'Valor referente ao mês está incorreto!';
    return'ok'
  };

  public validaAno(dados):string{
    const AnoAtual = new Date().getFullYear();
    if(dados !== null)dados = parseInt(dados);
    if(dados !== AnoAtual)return 'Ano informado está diferente do ano que estamos!';
    if(dados === null)return 'Por favor, informa o ano da dívida!';
    if(dados <= 0)return 'Valor referente ao ano está incorreto!';
    return'ok'
  };

  public validaOque(dados):string{
    if(dados !== null)dados = dados.trim();
    if(dados === null)return 'Por favor, informa ”O que foi comprado" da dívida!';
    if(dados === '')return 'Por favor, informa ”O que foi comprado" da dívida!';
    if(dados.length < 3)return 'Valor "Oque" é invalido!';
    return'ok'
  };

  public validaOnde(dados):string{
    if(dados !== null)dados = dados.trim();
    if(dados === null)return 'Por favor, informa "Onde foi realizado" a dívida!';
    if(dados === '')return 'Por favor, informa "Onde foi realizado" a dívida!';
    if(dados.length < 3)return 'Valor "Onde" é invalido!';
    return'ok'
  };

  public validaQuanto(dados):string{
    if(dados !== null)dados = parseFloat(dados)
    if(dados === null)return 'Por favor, informa o valor da dívida!';
    if(dados <= 0)return 'Valor da compra está incorreto!';
    return'ok'
  };

  public validaComo(dados):string{
    if(dados !== null)dados = dados.trim();
    if(dados === null)return 'Por favor, informa "como foi realizado" o pagamento!';
    if(dados === '')return 'Por favor, informa "como foi realizado" o pagamento!';
    if(dados.length < 3)return 'Valor "Como" é invalido!';
    return'ok'
  };

  public validaCategoria(dados):string{
    if(dados !== null)dados = dados.trim();
    if(dados === null)return 'Por favor, escolha uma categoria para a dívida!';
    if(dados === '')return 'Por favor, escolha uma categoria para a dívida!';
    return'ok'
  };

  public salvaDespesa(dadosDivida):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
      this.crud.acrescentaValorNoDb(`dividas/${dadosDivida.uidUser}/`,dadosDivida)
      .then(res=>{resolve(res)})
      .catch(err=>{reject(err)})
    });
  }

  public alteraDadosDespesa(dadosDivida,uidDivida):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
      this.crud.atualizaValorNoDb(`dividas/${dadosDivida.uidUser}/${uidDivida}`,dadosDivida)
      .then(res=>{resolve(res)})
      .catch(err=>{reject(err)})
    });
  }

  public pegaListaDeDividas(path):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
      this.crud.pegaValorNoDb(path).then(res=>{
        resolve(res)
      })
      .catch(err=>{
        reject(err)
      })
    });
  }

  public apagaDivida(path,idUser,idDivida):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
      this.crud.deletaValorNoDb(`${path}/${idUser}/${idDivida}`).then(ok=>{resolve('ok')}).catch(err=>{reject(err)});
    });
  }

  public geraIdDividaOffline(listaDividas):string{
    const totalDeLetrasParaComporOId:number = 6;
    const letrasAlfabeticas:Array<string> = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let juncaoDeLetras='';
    const numeroJuncao = (new Date().getTime() / 1000) * Math.random();
    let indiceLetraUser;
    for(let x= 0;x<totalDeLetrasParaComporOId;x++){
      indiceLetraUser = Math.ceil(Math.random() * (25 - 0) + 0);
      juncaoDeLetras += letrasAlfabeticas[indiceLetraUser]
    }
    let idOfflie = juncaoDeLetras+numeroJuncao;
    for(let key in listaDividas){
      if(listaDividas[key].idOfflie){
        if(listaDividas[key].idOfflie === idOfflie){
            this.geraIdDividaOffline(listaDividas);
        }
      }
    }
    return idOfflie;
  }

}
