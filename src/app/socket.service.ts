import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public connected = this.socket.fromEvent<any>('connected');

  constructor(private socket: Socket) { }

  startListening() {
    let msg = "Hai"
    this.socket.emit('connect', msg);

  }
}
