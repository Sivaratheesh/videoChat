import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiserviceService } from 'src/app/apiservice.service';
import { SocketService } from 'src/app/socket.service';


@Component({
  selector: 'app-singel-to-many',
  templateUrl: './singel-to-many.component.html',
  styleUrls: ['./singel-to-many.component.scss']
})
export class SingelToManyComponent implements OnInit, OnDestroy {

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
  ngOnDestroy(): void {
    this.localStream.getTracks().forEach((track:any)=> {
      track.stop();
    });
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('rtcCode')){
      this.roomId = sessionStorage.getItem('rtcCode');
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
    this.socketService.room_created.subscribe((even: any) => {
      console.log("room done", even);
      this.isRoomCreator = true
    })
    this.socketService.room_joined.subscribe((even: any) => {
      console.log('joined', even);

      this.socketService.startCall(this.roomId)
    })
    this.socketService.start_Call.subscribe(async (event: any) => {
      console.log("start", event);
      // this.remoteID= event;
      let id = event+this.socketService.socket.ioSocket.id
      id = id.replaceAll(/\s/g,'');
      if (id) {
        if(this.localConnection && this.localConnection.length && !this.localConnection.some(connection => connection[id] === id )){
          this.localConnection.push ({ [id]: { peer: await new RTCPeerConnection(this.iceServers) }, id:id });
        }else if (this.localConnection.length===0) {
          this.localConnection.push ({ [id]: { peer: await new RTCPeerConnection(this.iceServers) }, id:id });
        }
        let connection =  this.localConnection.find((con:any) => con.id === id)
        this.localStream.getTracks().forEach((track: any) => {
         connection[id].peer.addTrack(track, this.localStream);
        });
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
        // const connection =  this.localConnection.find((con:any) => con.id === id)

        connection[id].peer.addEventListener('track', async (event: any) => {
          remStream.addTrack(event.track, remStream);
        });
        
        connection[id].peer.onicecandidate = (event: any) => {
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
        connection[id].peer.createOffer().then((off:any)=>{
          connection[id].peer.setLocalDescription(off).then(async (res:any)=>{
            let offerObj = {
              type: 'webrtc_offer',
              sdp: off,
              roomId: this.roomId,
              id: id,
              ansId: this.socketService.socket.ioSocket.id,
              offId: event
    
            }
            await this.socketService.webrtc_offer_mm(offerObj);
          })
        });
        // await this.localConnection[id].peer.setLocalDescription(offer);
        // let offerObj = {
        //   type: 'webrtc_offer',
        //   sdp: offer,
        //   roomId: this.roomId,
        //   id: id

        // }
        // await this.socketService.webrtc_offer(offerObj);
      }

    })

    this.socketService.webrtc_offers_mm.subscribe(async (event: any) => {
      let id = event.id
      if ( event ) {
        console.log("offer", event);
        this.myId = event.id;
        if(this.localConnection && this.localConnection.length && !this.localConnection.some(connection => connection[id] === id )){
          this.localConnection.push ({ [id]: { peer: await new RTCPeerConnection(this.iceServers) }, id:id });
        }else if (this.localConnection.length===0){
          this.localConnection.push ({ [id]: { peer: await new RTCPeerConnection(this.iceServers) }, id:id });
        }
        for(const remoteid of event.ids){
          let connection =  this.localConnection.find((con:any) => con.id === remoteid)
          this.localStream.getTracks().forEach((track: any) => {
            connection[remoteid].peer.addTrack(track, this.localStream);
          });
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
          // const connection =  this.localConnection.find((con:any) => con.id === id)
  
          connection[remoteid].peer.addEventListener('track', async (event: any) => {
            remStream.addTrack(event.track, remStream);
          });
          connection[remoteid].peer.onicecandidate = (event: any) => {
            if (event.candidate) {
              let data = {
                roomId: this.roomId,
                label: event.candidate.sdpMLineIndex,
                candidate: event.candidate.candidate,
                id: remoteid
              }
              this.socketService.webrtc_ice_candidate(data);
            }
          }
          await connection[remoteid].peer.setRemoteDescription(new RTCSessionDescription(event.sdp));
          // if(this.localConnection[id].peer){
            connection[remoteid].peer.createAnswer().then( (ans:any) =>{
              connection[remoteid].peer.setLocalDescription(ans).then( async (res:any)=>{
                let offerObj = {
                  type: 'webrtc_answer',
                  sdp: ans,
                  roomId: this.roomId,
                  id:this.myId,
                  ansId: event.ansId,
                }
                await this.socketService.webrtc_ans_mm(offerObj);
              this.localVideo.style.display = "block";
              this.spinner.hide();
              })
            });
        }
       
        //   await this.localConnection[id].peer.setLocalDescription(answer);
        //   let offerObj = {
        //     type: 'webrtc_answer',
        //     sdp: answer,
        //     roomId: this.roomId,
        //     id:this.myId 
        //   }
        //   await this.socketService.webrtc_answer_sm(offerObj);
        // this.localVideo.style.display = "block";
        // this.spinner.hide();
        // }


      }
    })
    this.socketService.webrtc_anssm_mm.subscribe((event: any) => {
      let id = event.id

      for(const remoteid of event.ids){
        const connection =  this.localConnection.find((con:any) => con.id === id)

        console.log("answer", event);
        if (event.id && connection ) {
          // this.iceCandi = event.id
  
          connection[remoteid].peer.setRemoteDescription(new RTCSessionDescription(event.sdp));
          this.localVideo.style.display = "block";
          // this.spinner.hide();
        this.spinner.hide();
         
        }
      }
     
    })
    this.socketService.webrtc_ice_candidates.subscribe((event: any) => {
      let id = event.id
      for(const remoteid of event.ids){
        const connection =  this.localConnection.find((con:any) => con.id === remoteid)
   
        if (event.candidate && connection && connection[remoteid]) {
          // this.iceCandi = remoteid
          let candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate,
          })
          console.log("ice", event);
          console.log("ice", connection[remoteid]);
          connection[remoteid].peer.addIceCandidate(candidate);
        }
      }
     
    })
    this.joinRoom();
  }
  public async joinRoom() {
    if (this.roomId.length) {
      this.localVideo.style.display = "none"
      await this.socketService.createRoom(this.roomId);
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
  public logOut() {
    this.socketService.OfflineUser(this.user);
    localStorage.clear();
    this.router.navigate(['/']);
  }
  public onClick() {
    this.onTabClick = this.onTabClick === true ? false : true;
  }

}
