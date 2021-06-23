import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public connected = this.socket.fromEvent<any>('connected');
  public receiveMessage = this.socket.fromEvent<any>('receiveMessage');
  public onlineUser = this.socket.fromEvent<any>('onlineUser');


  constructor(private socket: Socket) { }

  startListening() {
    let msg = "Hai"

    this.socket.emit('hello', msg);
  }

  sendMessage(msg: any) {
    this.socket.emit('chatting', msg);
  }

  iAmInOnline(data: any) {
    this.socket.emit('online', data)
  }
}
