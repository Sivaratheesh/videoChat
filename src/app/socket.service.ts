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
  public room_created = this.socket.fromEvent<any>('room_created');
  public room_joined = this.socket.fromEvent<any>('room_joined');
  public start_Call = this.socket.fromEvent<any>('start_call');
  public start_Call_mm = this.socket.fromEvent<any>('start_call_mm');
  public webrtc_offers = this.socket.fromEvent<any>('webrtc_offers');
  public webrtc_answers = this.socket.fromEvent<any>('webrtc_answers');
  public webrtc_answers_sm = this.socket.fromEvent<any>('webrtc_anssm');
  public webrtc_ice_candidates = this.socket.fromEvent<any>('webrtc_ice_candidates');
  public hanguped = this.socket.fromEvent<any>('hanguped');

  constructor(public socket: Socket) { }

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
   console.log(data);
    this.socket.emit('videoService', data);
  }
  startCall(data:any){
    this.socket.emit('start_calls', data)

  }
  webrtc_ice_candidate(data:any){
    this.socket.emit('webrtc_ice_candidate', data)

  }
  webrtc_offer(data:any){
    this.socket.emit('webrtc_offer', data)

  }
  webrtc_answer(data:any){
    this.socket.emit('webrtc_answer', data)

  }

  webrtc_answer_sm(data:any){
    this.socket.emit('webrtc_ans', data)

  }
  hangup(data:any){
    this.socket.emit('hangup', data)

  }
  startCall_mm(data:any){
    this.socket.emit('start_calls_mm', data)

  }
}