import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicChatComponent } from './public-chat/public-chat.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: PublicChatComponent },
  { path: 'private', component: PrivateChatComponent },

  // { path: 'register', component: RegisterComponent },
]

@NgModule({
  declarations: [
    PublicChatComponent,
    PrivateChatComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class ChatModule { }
