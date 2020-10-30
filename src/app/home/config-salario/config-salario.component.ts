import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { ConfigService } from '../../shared/config.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-config-salario',
  templateUrl: './config-salario.component.html',
  styleUrls: ['./config-salario.component.scss'],
})
export class ConfigSalarioComponent implements OnInit {
  public dadosSalario = new FormGroup({
    'salario':new FormControl(null)
  });
  public loadingSlavar:boolean = false;
  
  constructor(
    public conf:ConfigService,
    public alertController: AlertController
    ) { }

  ngOnInit() {}
  public salvarSalario():void{
    this.loadingSlavar = true;
    let testeValor = this.validaValorSalario(this.dadosSalario.value.salario);
    if(testeValor !== 'ok'){
      this.loadingSlavar = false;
      this.presentAlert('OPS!','Erro',testeValor);
    }else{
      this.conf.salvarSalario(`salario/${localStorage.getItem('UID')}/`,this.dadosSalario.value.salario)
      .then(res=>{
        localStorage.setItem('salario',this.dadosSalario.value.salario);
        this.dadosSalario.reset();
        this.loadingSlavar = false;
      })
      .catch(err=>{
        this.loadingSlavar = false;
        this.presentAlert('OPS!','Erro',err);
      })
    }
  }

  public validaValorSalario(valor):string{
    if(valor !== null)valor = parseFloat(valor);
    if(valor === null)return 'Valor invalido!';
    if(valor === '')return 'Valor invalido!';
    if(valor <= 0)return 'O valor do salário deve ser maior que 0';
    return 'ok';
  }

  async presentAlert(titulo,subtitulo,msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: subtitulo,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
