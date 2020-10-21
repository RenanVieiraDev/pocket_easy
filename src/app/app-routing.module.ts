import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CadastroNovoUserComponent } from './user/cadastro-novo-user/cadastro-novo-user.component';
import { LoginComponent } from './user/login/login.component';
import { AuthService } from './shared/auth.service';
import { DashuserComponent } from './home/dashuser/dashuser.component';
import { ConfHirarquiaCatComponent } from './home/conf-hirarquia-cat/conf-hirarquia-cat.component';
import { TutorialConfComponent } from './home/tutorial-conf/tutorial-conf.component';
import { SenhaResetComponent } from './user/senha-reset/senha-reset.component';


const routes: Routes = [
  {
    path: 'home', canActivate:[AuthService],
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',redirectTo: 'home',pathMatch: 'full',canActivate:[AuthService]
  },
  {path:'login',component:LoginComponent},
  {path:'cadastro',component:CadastroNovoUserComponent},
  {path:'resetsenha',component:SenhaResetComponent},
  {path:'dashboard',component:DashuserComponent,canActivate:[AuthService]},
  {path:'confCat',component:ConfHirarquiaCatComponent,canActivate:[AuthService]},
  {path:'ajustesUserConfig',component:TutorialConfComponent,canActivate:[AuthService]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
