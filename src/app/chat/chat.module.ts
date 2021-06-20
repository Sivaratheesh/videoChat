import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicChatComponent } from './public-chat/public-chat.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';



@NgModule({
  declarations: [
    PublicChatComponent,
    PrivateChatComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ChatModule { }
