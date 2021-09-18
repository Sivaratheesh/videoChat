import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicChatComponent } from './public-chat/public-chat.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SingleRoomComponent } from './single-room/single-room.component';
import { SingelToManyComponent } from './singel-to-many/singel-to-many.component';

const routes: Routes = [
  { path: '', component: SingelToManyComponent },
  { path: 'private', component: PrivateChatComponent },

  // { path: 'register', component: RegisterComponent },
]

@NgModule({
  declarations: [
    PublicChatComponent,
    PrivateChatComponent,
    HomeComponent,
    SingleRoomComponent,
    SingelToManyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class ChatModule { }
