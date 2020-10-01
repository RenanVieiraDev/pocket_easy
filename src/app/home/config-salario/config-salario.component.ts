import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { ConfigService } from '../../shared/config.service';

@Component({
  selector: 'app-config-salario',
  templateUrl: './config-salario.component.html',
  styleUrls: ['./config-salario.component.scss'],
})
export class ConfigSalarioComponent implements OnInit {
  public dadosSalario = new FormGroup({
    'salario':new FormControl(null)
  });
  
  constructor(public conf:ConfigService) { }

  ngOnInit() {}
  public salvarSalario():void{
    let testeValor = this.validaValorSalario(this.dadosSalario.value.salario);
    if(testeValor !== 'ok'){
      console.log(testeValor)
    }else{
      this.conf.salvarSalario(`salario/${localStorage.getItem('UID')}/`,this.dadosSalario.value.salario)
      .then(res=>{
        localStorage.setItem('salario',this.dadosSalario.value.salario);
        this.dadosSalario.reset();
      })
      .catch(err=>{console.log(err)})
    }
  }

  public validaValorSalario(valor):string{
    if(valor !== null)valor = parseFloat(valor);
    if(valor === null)return 'Valor invalido!';
    if(valor === '')return 'Valor invalido!';
    if(valor <= 0)return 'O valor do salario deve ser maior que 0';
    return 'ok';
  }

}
