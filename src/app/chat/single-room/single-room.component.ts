import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-single-room',
  templateUrl: './single-room.component.html',
  styleUrls: ['./single-room.component.scss']
})
export class SingleRoomComponent implements OnInit , OnDestroy{

  public users: any[] = []
  public IsMicEnable: boolean = true;
  public IsMicEnablePublic: boolean = true;
  public userName: any;
  public userNameText: any;
  public user: any;
  onTabClick: boolean = false;
  public publicMessage: any[] = [];
  localMsg: any;
  localConnection: any;
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
  constructor(private router: Router, private renderer: Renderer2, private socketService: SocketService, private apiservice: ApiserviceService) {
 
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
  ngOnDestroy(): void {
    this.localStream.getTracks().forEach((track:any)=> {
      track.stop();
    });
  }

  ngOnInit(): void {
   
    if(sessionStorage.getItem('rtcCode')){
      this.roomId = sessionStorage.getItem('rtcCode');
      this.rtcConnection();
    }else{
      this.router.navigate(['app']);
    }
    
  }
  public rtcConnection(){
    this.localId =  document.getElementById("localVideo")
    this.remoteId  =  document.getElementById("remoteVideo")
    this.localVideo = document.getElementById("localLocal");
    this.remoteVideo = document.getElementById("localRemote");
    this.remoteLocal = document.getElementById("remoteLocal");
    this.remoteRemote = document.getElementById("remoteRemote");
    this.socketService.room_created.subscribe((even: any) => {
      console.log("room created", even);
      this.isRoomCreator = true
    })
    this.socketService.room_joined.subscribe((even: any) => {
      console.log('joined', even);

      this.socketService.startCall(this.roomId)
    })
    this.socketService.start_Call.subscribe(async (event: any) => {
      console.log("start", event);
      this.remoteID= event;
      let id = event;
      if (this.isRoomCreator && id) {
        this.localConnection = { [id]: { peer: await new RTCPeerConnection(this.iceServers) } };
        this.localStream.getTracks().forEach((track: any) => {
          this.localConnection[id].peer.addTrack(track, this.localStream);
        });
        this.remoteRemote.srcObject = this.remoteStream;
        this.remoteVideo.srcObject = this.remoteStream;
        this.remoteRemote.controls = false;
        this.remoteVideo.controls = false;
        this.localConnection[id].peer.addEventListener('track', async (event: any) => {
          this.remoteStream.addTrack(event.track, this.remoteStream);
        });
        this.localConnection[id].peer.onicecandidate = (event: any) => {
          if (event.candidate) {
            let data = {
              roomId: this.roomId,
              label: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
              id: id
            }
            this.socketService.webrtc_ice_candidate(data)

          }
        }
        const offer = await this.localConnection[id].peer.createOffer();
        await this.localConnection[id].peer.setLocalDescription(offer);
        let offerObj = {
          type: 'webrtc_offer',
          sdp: offer,
          roomId: this.roomId,
          id: id

        }
        await this.socketService.webrtc_offer(offerObj);
      }

    })

    this.socketService.webrtc_offers.subscribe(async (event: any) => {
      if (!this.isRoomCreator && event) {
        console.log("offer", event);
        let id = event.id
        this.localConnection = { [id]: { peer: await new RTCPeerConnection(this.iceServers) } };
        this.localStream.getTracks().forEach((track: any) => {
          this.localConnection[id].peer.addTrack(track, this.localStream);
        });
        this.remoteRemote.srcObject = this.remoteStream;
        this.remoteVideo.srcObject = this.remoteStream;
        this.remoteRemote.controls = false;
        this.remoteVideo.controls = false;
        this.localConnection[id].peer.addEventListener('track', async (event: any) => {
          this.remoteStream.addTrack(event.track, this.remoteStream);
        });
        this.localConnection[id].peer.onicecandidate = (event: any) => {
          if (event.candidate) {
            let data = {
              roomId: this.roomId,
              label: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
              id: id
            }
            this.socketService.webrtc_ice_candidate(data);
          }
        }
        await this.localConnection[id].peer.setRemoteDescription(new RTCSessionDescription(event.sdp));
        const answer = await this.localConnection[id].peer.createAnswer();
        await this.localConnection[id].peer.setLocalDescription(answer);
        let offerObj = {
          type: 'webrtc_answer',
          sdp: answer,
          roomId: this.roomId

        }
        await this.socketService.webrtc_answer(offerObj);
      }
      this.remoteId.style.display = "block"
    })
    this.socketService.webrtc_answers.subscribe((event: any) => {
      let id = event.id
      console.log("answer", event);
      if (event) {
        this.localConnection[id].peer.setRemoteDescription(new RTCSessionDescription(event.sdp));

      }
      this.remoteId.style.display = "block"

    })
    this.socketService.webrtc_ice_candidates.subscribe((event: any) => {
      let id = event.id
      console.log("ice", event);
      console.log("ice", this.localConnection[id]);
      if (event.candidate && this.localConnection[id]) {
        let candidate = new RTCIceCandidate({
          sdpMLineIndex: event.label,
          candidate: event.candidate,
        })
        this.localConnection[id].peer.addIceCandidate(candidate);
      }
    })
    if(this.remoteId && this.localId){
      this.localId.style.display = "none"
      this.remoteId.style.display = "none"
    }
    this.socketService.hanguped.subscribe(res =>{
      if(this.roomId === res){
        this.localConnection = null;
        this.remoteConnection = null;
        this.remoteStream= new MediaStream();
        this.localStream= new MediaStream();
        this.roomId='';
        this.localStream.getTracks().forEach((track:any)=> {
          track.stop();
        });
        this.router.navigate(['app'])
      }
    })
    this.joinRoom();
  }
  public async joinRoom() {
    if (this.roomId.length) {
      await this.socketService.createRoom(this.roomId);
      const constraints = { 'video': true, 'audio': { 'echoCancellation': true }, };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localVideo.controls = false;
      this.localVideo.muted = true;
      this.remoteVideo.width = 200;
      this.remoteVideo.height = 130;
      this.localVideo.srcObject = stream;
      this.remoteLocal.srcObject = stream;
      this.localVideo.volume = 0;
      this.localStream = stream;
      this.remoteLocal.controls = false;
      this.remoteLocal.muted = true;
      this.remoteLocal.width = 200;
      this.remoteLocal.height = 130;
      this.remoteLocal.volume = 0;
    }
  }
  public logOut() {
    this.socketService.OfflineUser(this.user);
    localStorage.clear();
    this.router.navigate(['/']);
  }
  public onClick() {
    this.onTabClick = this.onTabClick === true ? false : true;
  }
  public show(value: any) {
    if (value == 'local') {
      this.localId.style.display = "block"
      this.remoteId.style.display = "none"
    }else if (value == 'remote') {
      this.localId.style.display = "none"
      this.remoteId.style.display = "block"

    }

  }
  public hangUp() {
    this.localConnection = null;
    this.remoteConnection = null;
    this.remoteStream= new MediaStream();
    this.localStream= new MediaStream();
    this.socketService.hangup(this.roomId);
    this.roomId='';
    this.localStream.getTracks().forEach((track:any)=> {
      track.stop();
    });
    this.router.navigate(['app'])
  }
}
