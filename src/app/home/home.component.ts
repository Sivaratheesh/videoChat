import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { SocketService } from '../socket.service';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public width = 320;    // We will scale the photo width to this
  public height = 0;     // This will be computed based on the input stream
  public streaming = false;
  public cameraSrc: any;
  public canvas: any;
  public photo: any;
  public startbutton = null;
  public localConnection: any;
  public remoteConnection: any;
  public sendChannel: any;
  public receiveChannel: any;
  public localMsg: any
  public data: any= [];
  public person: any;
  public channel: any;
  public offer: any;
  public answer: any;
  admin: boolean = false;
  attendee: boolean = false;
  public acceptoffer:any;
  public acceptanswer:any

  constructor(public socketservice :SocketService, public apiservice:ApiserviceService ) {

    if(localStorage.getItem('data')){
      this.data = sessionStorage.getItem('data') ;

    }
    this.socketservice.receiveMessage.subscribe(data =>{
      this.data.push(data);
      sessionStorage.setItem('data',JSON.stringify (this.data));
    })
   }

  ngOnInit(): void {
    this.person = prompt("Please enter your name", " ");
    this.person.trim();
    if (this.person === 'siva') {
      this.admin = true;
    } else {
      this.attendee = true;
    }
    this.createConnection();
  
    // let cameraSrc = <HTMLVideoElement>document.querySelector('video');
    // this.videoseervice.video =  cameraSrc
    // this.videoseervice.getvideo();
    // this.apiservice.getIssues().subscribe(data =>{
    //   console.log(data);
    //   // console.log(this.socketservice);

    // })
    // this.apiservice.getuseer().subscribe((data: any) => {
    //   console.log(data);
    // });
    // this.socketservice.startListening();
    // this.socketservice.connected.subscribe(data => {
    //   console.log(data);
    // })
    this.socketservice.connected.subscribe(data => {
      console.log(data);
    });
  }
  public connect() {
    this.socketservice.startListening();
    // this.socketservice.connected.subscribe(data => {
    //   console.log(data);
    // });
  }

  public createConnection() {
    
    // const dataChannelOptions = {
    //   ordered: false, // do not guarantee order
    //   maxPacketLifeTime: 3000, // in milliseconds
    // };

    // const servers: any = null;
    this.localConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    console.log('Created local peer connection object localConnection');
    this.localConnection.ondatachannel = (event: any) => {
      console.log('ondatachannel');
      this.channel = event.channel;
      console.log(this.channel);
      // this.data.push(event.data);
      this.remoteConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      console.log('Created remote peer connection object remoteConnection');
      // if (this.remoteConnection.onicecandidate) {
      //   this.remoteConnection.onicecandidate((e: any) => {
      //     this.onIceCandidate(this.remoteConnection, e);
      //     // this.remoteConnection.ondatachannel = this.receiveChannelCallback(e);
      //   });
  
      //   // this.remoteConnection.onicecandidate = (e: any) => {
      //   //   this.onIceCandidate(this.remoteConnection, e);
      //   // };
      //   // this.remoteConnection.ondatachannel = (event: any) => {this.receiveChannelCallback(event)}
      // }
    }
    this.localConnection.onconnectionstatechange = (event: any) => console.log(this.localConnection.connectionState) // console.log('onconnectionstatechange', connection.connectionState)
    this.localConnection.oniceconnectionstatechange = (event: any) => console.log(this.localConnection.iceConnectionState) // console.log('oniceconnectionstatechange', connection.iceConnectionState)

    if (this.person === 'siva') {
      this.createOffer1();
      // this.sendChannel = this.localConnection.createDataChannel('sendDataChannel');
      console.log('Created send data channel');
      if (this.localConnection.onicecandidate) {
        // this.localConnection.onicecandidate((e: any) => {
        //   this.onIceCandidate(this.localConnection, e);
        // });
        // this.localConnection.onicecandidate = (e: any) => {
        //   this.onIceCandidate(this.localConnection, e);
        // };
      }
      // this.sendChannel.onmessage = (event: any) => {
      //   console.log("Got Data Channel Message:", event.data);
      // };
    //   if(this.sendChannel){
    //   // this.sendChannel.onopen = this.onSendChannelStateChange();
    //   // this.sendChannel.onclose = this.onSendChannelStateChange();
    //   }
    //   this.localConnection.createOffer().then( (e:any) =>{
    //     this.gotDescription1(e)
    //   }

    // ),(error:any) =>{
    //   this.onCreateSessionDescriptionError(error);

    // };
    }else{
  
   
    }
 
 
    // console.log(this.localConnection);
    // this.localConnection.createOffer().then((e: any) => {
    //   this.gotDescription1(e)

    // }
    //   // this.onCreateSessionDescriptionError
    // );
// if(this.answer && this.person == 'siva'){
//   this.acceptAnswer();
// }
  }
  // public gotDescription1(desc: any) {

  //   if (this.localConnection) {
  //     this.localConnection.setLocalDescription(desc);
      
  //     console.log(`Offer from localConnection\n${JSON.stringify(this.localConnection.localDescription)}`);
  //   }
// if(this.remoteConnection){
//   this.remoteConnection.setRemoteDescription(desc);
//   this.remoteConnection.createAnswer().then( (e:any) => {
//    this.gotDescription2(e);
//   }
//   ),(error:any) =>{
//     this.onCreateSessionDescriptionError(error);
//   };
// }
   

    // this.remoteConnection.createAnswer().then((e: any) => {
    //   this.gotDescription2(e)

    // }
    //   // this.onCreateSessionDescriptionError
    // );
  // }
  public onCreateSessionDescriptionError(error: any) {
    console.log('Failed to create session description: ' + error.toString());
  }
  public gotDescription2(desc: any) {
    this.remoteConnection.setLocalDescription(desc);
    console.log(`Answer from remoteConnection\n${JSON.stringify(this.remoteConnection.localDescription)}`);
    this.localConnection.setRemoteDescription(desc);
  }
  // public onIceCandidate(pc: any, event: any) {
  //   this.getOtherPc(pc)
  //     .addIceCandidate(event.candidate)
  //     .then( (e:any) =>{
  //       this.onAddIceCandidateSuccess
  //     }
  //     ),
  //    ( error:any) =>{
  //     this.onAddIceCandidateError
  //    };
  //   console.log(`${this.getName(pc)} ICE candidate: ${event.candidate ? event.candidate.candidate : '(null)'}`);
  // }

  public getOtherPc(pc: any) {
    console.log(pc);
    console.log(this.localConnection);
    return (pc === this.localConnection) ? this.remoteConnection : this.localConnection;
  }
  public onAddIceCandidateSuccess() {
    console.log('AddIceCandidate success.');

  }
  public onAddIceCandidateError(error: any) {
    console.log(`Failed to add Ice Candidate: ${error.toString()}`);
  }
  public getName(pc: any) {
    return (pc === this.localConnection) ? 'localPeerConnection' : 'remotePeerConnection';
  }
  // public receiveChannelCallback(event: any) {
  //   console.log('Receive Channel Callback');
  //   this.receiveChannel = event.channel;
  //   this.receiveChannel.onmessage  = (eve:any) => this.onReceiveMessageCallback(eve);
  //   // this.receiveChannel.onopen = this.onReceiveChannelStateChange();
  //   // this.receiveChannel.onclose = this.onReceiveChannelStateChange();
  // }
  // public onReceiveMessageCallback(event: any) {
  //   console.log('Received Message');
  //   this.data.push(event.data);
  // }
  // public onReceiveChannelStateChange() {
  //   const readyState = this.receiveChannel.readyState;
  //   console.log(`Receive channel state is: ${readyState}`);
  // }
  // public onSendChannelStateChange() {
  //   const readyState = this.sendChannel.readyState;
  //   console.log('Send channel state is: ' + readyState);
  // }
  // public sendData() {
  //   const data = this.localMsg;
  //   this.data.push(data)
  //   this.sendChannel.send(data);
  //   console.log('Sent Data: ' + data);
  //   this.localMsg = '';
  // }
  public async createOffer1() {
    this.sendChannel = this.localConnection.createDataChannel('sendDataChannel');
    this.sendChannel.onmessage = (event: any) => {
      this.data.push(event.data);
      console.log("Got Data Channel Message:", event.data);
    };
    // this.channel = this.localConnection.createDataChannel('data');
    // this.channel.onmessage = (event: any) => {
    //   // alert(event.data)
    //   this.data.push(event.data); 
    // };
    this.localConnection.onicecandidate = (event: any) => {
      // console.log('onicecandidate', event)
      if (!event.candidate) {
        this.offer = this.localConnection.localDescription;
        console.log( JSON.stringify(this.offer));
      }
    }
    const offer = this.localConnection.createOffer();
    await this.localConnection.setLocalDescription(offer);
  }
  public async acceptOffer() {
    let data = JSON.parse(this.acceptoffer)
   await this.localConnection.setRemoteDescription(data);
    this.createAnswer();
  

  }
  public async createAnswer() {
    // this.channel.onmessage = (event: any) => alert(event.data);
    this.localConnection.onicecandidate = (event: any) => {
      // console.log('onicecandidate', event)
      if (!event.candidate) {
        this.answer = this.localConnection.localDescription;
        console.log(JSON.stringify (this.answer));
      }
    }

    const answer = this.localConnection.createAnswer()
  await this.localConnection.setLocalDescription(answer);
  if(!this.channel){
    this.sendChannel = this.localConnection.createDataChannel('sendDataChannel');
    this.sendChannel.onmessage = (event: any) => {
      this.data.push(event.data);
      console.log("Got Data Channel Message:", event.data);
    };
      
  }
  }
  public async acceptAnswer(){
    let data = JSON.parse(this.acceptanswer)
    await this.localConnection.setRemoteDescription(data);
  }
  public send_text() {
    const text = this.localMsg
    this.channel.send(text);
    this.localMsg = '';
}

public sendMessage(){
  this.socketservice.sendMessage(this.localMsg);
  this.data.push(this.localMsg);
  this.localMsg = '';


}
}
