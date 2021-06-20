import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'',loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule) },
  {path:'app',loadChildren: () => import('./chat/chat.module').then(mod => mod.ChatModule) }
];
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
