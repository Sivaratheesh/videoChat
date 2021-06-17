import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { SocketService } from '../socket.service';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,AfterViewInit{
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
  public data: any[] = [];
   public dataChannel: any;
   public dataChannel2: any;


  constructor() { }

  ngAfterViewInit(){
  console.log(this.dataChannel)
  }

  ngOnInit(): void {
    let messageBox:any = document.getElementById('input');
    let sendButton:any = document.getElementById('btn');

    // this.createConnection();
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
  //   this.socketservice.connected.subscribe(data => {
  //     console.log(data);
  //   });
  // }
  // public connect() {
  //   this.socketservice.startListening();
  //   this.socketservice.connected.subscribe(data => {
  //     console.log(data);
  //   });
  const configuration :any= null;
  const peerConnection = new RTCPeerConnection(configuration);
this.dataChannel = peerConnection.createDataChannel('sendDataChannel');
peerConnection.addEventListener('datachannel', event => {
  this.dataChannel2 = event.channel;
});
console.log(this.dataChannel2);
  this. dataChannel.addEventListener('open', (event:any) => {
    messageBox.disabled = false;
    messageBox.focus();
    sendButton.disabled = false;
    console.log(event)
  });
  this.dataChannel.addEventListener('close', (event:any) => {
    messageBox.disabled = false;
    sendButton.disabled = false;
  });
  
  sendButton.addEventListener('click', (event:any )=> {
    const message = messageBox.textContent;
    this.data.push(message);
    this.dataChannel.send(message);
  })
  
  // Append new messages to the box of incoming messages
  this.dataChannel.addEventListener('message', (event:any ) => {
      const message = event.data;
    this.data.push(message);
      
  });


  }
  

//   public createConnection() {

//     const servers: any = null;
//     this.localConnection = new RTCPeerConnection(servers);
//     console.log('Created local peer connection object localConnection');
//     this.sendChannel = this.localConnection.createDataChannel('sendDataChannel');
//     console.log('Created send data channel');
//     if(this.localConnection.onicecandidate){
//       this.localConnection.onicecandidate((e: any) => {
//         this.onIceCandidate(this.localConnection, e);
//       });
//     }
//     this.sendChannel.onopen = this.onSendChannelStateChange;
//     this.sendChannel.onclose =this. onSendChannelStateChange;

//     this.remoteConnection = new RTCPeerConnection(servers);
//     console.log('Created remote peer connection object remoteConnection');
//     let rEvent:any;
//     if(this.remoteConnection.onicecandidate){
//       this.remoteConnection.onicecandidate((e: any) => {
//         this.onIceCandidate(this.remoteConnection, e);
//         rEvent = e;
//       });
//     }
//     if(rEvent){
//       this.remoteConnection.ondatachannel = this.receiveChannelCallback(rEvent);

//     }

   
//     this.localConnection.createOffer().then( (e:any) =>{
//       this.gotDescription1(e)
//     }
      
//   ),(error:any) =>{
//     this.onCreateSessionDescriptionError(error);

//   };
//   }
//   public gotDescription1(desc:any) {
//     this.localConnection.setLocalDescription(desc);
//     console.log(`Offer from localConnection\n${desc.sdp}`);
//     this.remoteConnection.setRemoteDescription(desc);
//     this.remoteConnection.createAnswer().then( (e:any) => {
//      this.gotDescription2(e);
//     }
//     ),(error:any) =>{
//       this.onCreateSessionDescriptionError(error);
//     };
//   }
//   public onCreateSessionDescriptionError(error:any) {
//     console.log('Failed to create session description: ' + error.toString());
//   }
//   public gotDescription2(desc:any) {
//     this.remoteConnection.setLocalDescription(desc);
//     console.log(`Answer from remoteConnection\n${desc.sdp}`);
//     this.localConnection.setRemoteDescription(desc);
//   }
//   public onIceCandidate(pc: any, event: any) {
//     this.getOtherPc(pc)
//       .addIceCandidate(event.candidate)
//       .then(
//         this.onAddIceCandidateSuccess(),
//       ), (err: any) => {
//         this.onAddIceCandidateError(err)
//       };
//     console.log(`${this.getName(pc)} ICE candidate: ${event.candidate ? event.candidate.candidate : '(null)'}`);
//   }

//   public getOtherPc(pc: any) {
//     return (pc === this.localConnection) ? this.remoteConnection : this.localConnection;
//   }
//   public onAddIceCandidateSuccess() {
//     console.log('AddIceCandidate success.');

//   }
//   public onAddIceCandidateError(error: any) {
//     console.log(`Failed to add Ice Candidate: ${error.toString()}`);
//   }
//   public getName(pc: any) {
//     return (pc === this.localConnection) ? 'localPeerConnection' : 'remotePeerConnection';
//   }
//   public receiveChannelCallback(event: any) {
//     console.log('Receive Channel Callback');
//     this.receiveChannel = event.channel;
//     this.receiveChannel.onmessage = this.onReceiveMessageCallback(event);
//     this.receiveChannel.onopen = this.onReceiveChannelStateChange();
//     this.receiveChannel.onclose = this.onReceiveChannelStateChange();
//   }
//   public onReceiveMessageCallback(event: any) {
//     console.log('Received Message');
//     this.data.push(event.data);
//   }
//   public onReceiveChannelStateChange() {
//     const readyState = this.receiveChannel.readyState;
//     console.log(`Receive channel state is: ${readyState}`);
//   }
//  public onSendChannelStateChange() {
//     const readyState = this.sendChannel.readyState;
//     console.log('Send channel state is: ' + readyState);
//   }
//   public sendData() {
//     const data = this.localMsg;
//     this.data.push(data)
//     this.sendChannel.send(data);
//     console.log('Sent Data: ' + data);
//     this.localMsg = '';
//   }
}
