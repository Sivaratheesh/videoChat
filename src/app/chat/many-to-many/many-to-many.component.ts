import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiserviceService } from 'src/app/apiservice.service';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-many-to-many',
  templateUrl: './many-to-many.component.html',
  styleUrls: ['./many-to-many.component.scss']
})
export class ManyToManyComponent implements OnInit, OnDestroy {

  public users: any[] = []
  public IsMicEnable: boolean = true;
  public IsMicEnablePublic: boolean = true;
  public userName: any;
  public userNameText: any;
  public user: any;
  onTabClick: boolean = false;
  public publicMessage: any[] = [];
  localMsg: any;
  public localConnection: any[] = [];
  channel: any;
  remoteConnection: any;
  sendChannel: any;
  offer: any;
  acceptoffer: any;
  answer: any;
  public requestData: any;
  createanswer: boolean | any;
  webRTCMsg: any;
  privateMessage: any[] = [];
  isAccepted: boolean | any;
  isRequestAccepted: boolean | any;
  hangUpbtn: boolean | any;
  blockRequest: boolean | any;
  declineAllCall: boolean | any;
  roomId: any;
  public iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
  }
  isRoomCreator: boolean | any;
  public localStream: any = new MediaStream();
  public remoteStream: any = new MediaStream();
  public localStreamA: any = new MediaStream();
  public remoteStreamA: any = new MediaStream();
  broadcasterId: any;
  localVideo: any | null;
  remoteVideo: any;
  local: any;
  remote: any;
  remoteID: any;
  remoteLocal: any | null;
  remoteRemote: any | null;
  localId: any | null;
  remoteId: any | null;
  myId: any;
  iceCandi: string = ''
  roomJoiniees: any = [];
  public roomJoinieesice: any = [];
  private peerConnections: { [userId: string]: RTCPeerConnection } = {};
  constructor(private router: Router, private renderer: Renderer2,
     private socketService: SocketService, private apiservice: ApiserviceService,
     private spinner: NgxSpinnerService) {
    this.remote = false;
    this.local = true;
    if (this.apiservice.getLocalStorage('user')) {
      this.user = this.apiservice.getLocalStorage('user');
      this.socketService.iAmInOnline(this.user);
    } else {
      alert('Please login');
      this.router.navigate(['/'])
    }
  }

  ngOnInit(): void {

// this.roomId = uuidv4();
if(sessionStorage.getItem('rtcCode')){
  this.roomId = sessionStorage.getItem('rtcCode');
  // this.initLocalStream()
}else{
  this.router.navigate(['app']);
}
this.spinner.show();
this.localId =  document.getElementById("localVideo")
this.remoteId  =  document.getElementById("remoteVideo")
this.localVideo = document.getElementById("localLocal");
this.remoteVideo = document.getElementById("localRemote");
this.remoteLocal = document.getElementById("remoteLocal");
this.remoteRemote = document.getElementById("remoteRemote");
this.initLocalStream();

this.socketService.socket.on('userJoined_MM', (users:any) => {
  // console.log("'userJoined_MM",users, "id",this.socketService.socket.ioSocket.id);
  
  this.createPeerConnection(users.users);
});

// this.socketService.socket.on('userLeft_MM', (users: string[]) => {
//   this.handleUserLeft(users);
// });

this.socketService.socket.on('offer_MM', (payload:any) => {

  this.handleOffer(payload.from, payload.offer);
});

this.socketService.socket.on('answer_MM', (payload:any) => {

  this.handleAnswer(payload.from, payload.answer);
});

this.socketService.socket.on('ice-candidate_MM', (candidate:any) => {
  console.log("'candidate_MM",candidate);

  this.handleIceCandidate(candidate.from, candidate.candidate);
});
  }
  async initLocalStream() {
    if (this.roomId && this.roomId.length) {
          this.localVideo.style.display = "none";
     await this.socketService.socket.emit('joinRoom_MM',this.roomId);
          const constraints = { 'video': true, 'audio': { 'echoCancellation': true }, };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if(stream){
            this.localVideo.controls = false;
            this.localVideo.muted = true;
            this.localVideo.srcObject = stream;
            this.localVideo.volume = 0;
            this.localStream = stream;
            this.localVideo.width=200;
            this.localVideo.height=300;
          }
  }
  }
  async createPeerConnection(users:any) {
    let isOfferer = false;
    if(users[users.length-1] === this.socketService.socket.ioSocket.id){
      isOfferer = true;
    }
    for(const userId  of  users){
    const peerConnection = new RTCPeerConnection(this.iceServers);
    this.peerConnections[userId] = peerConnection;

    this.localStream.getTracks().forEach((track:any) => {
      peerConnection.addTrack(track, this.localStream);
    });
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.socket.emit('ice-candidate_MM', { to: userId, candidate: event.candidate,roomId:this.roomId });
      }
    };
    const remStream:any = new MediaStream();
              const remoteVideo: any = document.getElementById("remote");
            var v = document.createElement ("video");
            v.srcObject = remStream;
            v.controls = false;
            v.autoplay = true;
            v.playsInline = true;
            v.loop =true;
            v.muted = true;
            v.width=200;
            v.height=300;
            remoteVideo.appendChild (v);
    peerConnection.ontrack = (event) => {
      remStream.addTrack(event.track, remStream);
      // Handle incoming media stream (e.g., display it in a <video> element)
    };
if(isOfferer && userId !== this.socketService.socket.ioSocket.id){
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  this.socketService.socket.emit('offer_MM', { to: userId, offer ,roomId:this.roomId});
}


  }
  }
  private async handleOffer(userId: string, offer: RTCSessionDescriptionInit){
    const peerConnection = new RTCPeerConnection(this.iceServers);
    this.peerConnections[userId] = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.socket.emit('ice-candidate_MM', { to: userId, candidate: event.candidate ,roomId:this.roomId});
      }
    };
    const remStream:any = new MediaStream();
    const remoteVideo: any = document.getElementById("remote");
    var v = document.createElement ("video");
    v.srcObject = remStream;
    v.controls = false;
    v.autoplay = true;
    v.playsInline = true;
    v.loop =true;
    v.muted = true;
    v.width=200;
    v.height=300;
    remoteVideo.appendChild (v);
    peerConnection.ontrack = (event) => {
      remStream.addTrack(event.track, remStream);
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
  
    this.socketService.socket.emit('answer_MM', { to: userId, answer, roomId:this.roomId });
    this.localVideo.style.display = "block";
    this.spinner.hide();
  }
  private async handleAnswer(userId: string, answer:any){
    const peerConnection = this.peerConnections[userId];
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    this.localVideo.style.display = "block";
    this.spinner.hide();
  }
  private async handleIceCandidate(userId: string, candidate: RTCIceCandidate){
    const peerConnection = this.peerConnections[userId];
    await peerConnection.addIceCandidate(candidate);
  }
  public logOut() {
    this.socketService.OfflineUser(this.user);
    localStorage.clear();
    this.router.navigate(['/']);
  }
  public onClick() {
    this.onTabClick = this.onTabClick === true ? false : true;
  }
  ngOnDestroy(): void {
    this.localStream.getTracks().forEach((track:any)=> {
      track.stop();
    });
  }

}