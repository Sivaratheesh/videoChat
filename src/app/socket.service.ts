import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public connected = this.socket.fromEvent<any>('connected');
  public receiveMessage = this.socket.fromEvent<any>('receiveMessage');
  public onlineUser = this.socket.fromEvent<any>('onlineUser');
  public offer = this.socket.fromEvent<any>('offer');
  public answer = this.socket.fromEvent<any>('answer');
  public hangupCall = this.socket.fromEvent<any>('hangupCall');
  public anOtherCall = this.socket.fromEvent<any>('anOtherCall');
  public onlineUsers = this.socket.fromEvent<any>('onlineUsers');
  public roomEvent = this.socket.fromEvent<any>('roomEvent');
  public roomVideo = this.socket.fromEvent<any>('roomVideo');


  constructor(private socket: Socket) { }

  startListening() {
    let msg = "Hai"
    this.socket.emit('hello', msg);
  }

  sendMessage(msg: any) {
    this.socket.emit('chatting', msg);
  }

  iAmInOnline(data: any) {
    this.socket.emit('online', data);
  }

  sendOffer(data: any) {
    this.socket.emit('SendOffer', data);
  }

  sendAnswer(data: any) {
    this.socket.emit('sendAnswer', data);
  }
  hangUp(data: any) {
    this.socket.emit('hangUp', data);
  }
  alreadyConnected(data: any) {
    this.socket.emit('alreadyConnected', data);
  }
  OfflineUser(data: any) {

    this.socket.emit('logoutUser', data);
  }
  createRoom(data: any) {

    this.socket.emit('createRoom', data);
  }
  roomMessage(data: any) {

    this.socket.emit('roomMessage', data);
  }
  videoService(data: any) {

    this.socket.emit('videoService', data);
  }
  
}
