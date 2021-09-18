import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicChatComponent } from './public-chat/public-chat.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SingleRoomComponent } from './single-room/single-room.component';
import { SingelToManyComponent } from './singel-to-many/singel-to-many.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NgxSpinnerModule } from 'ngx-spinner';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'one2one', component: SingleRoomComponent },
  { path: 'many2one', component: SingelToManyComponent },


  // { path: 'register', component: RegisterComponent },
]

@NgModule({
  declarations: [
    PublicChatComponent,
    PrivateChatComponent,
    HomeComponent,
    SingleRoomComponent,
    SingelToManyComponent,
    NgxSpinnerModule
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class ChatModule { }
