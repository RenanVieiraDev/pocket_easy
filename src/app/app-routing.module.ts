import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CadastroNovoUserComponent } from './user/cadastro-novo-user/cadastro-novo-user.component';
import { LoginComponent } from './user/login/login.component';
import { AuthService } from './shared/auth.service';

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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
