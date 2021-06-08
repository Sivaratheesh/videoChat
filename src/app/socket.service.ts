import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
public connected = this.socket.fromEvent<any>('connected');
  constructor(private socket: Socket) { }

  startListening() {
    this.socket.emit('connect');

  }
}
