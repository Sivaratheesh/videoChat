import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { SocketService } from '../socket.service';

const config: SocketIoConfig = { url:environment.socketUrl, options: { origin:'*', transport : ['websocket']} };


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SocketIoModule.forRoot(config),

  ],
  providers:[SocketService]
})
export class SharedModule { }
