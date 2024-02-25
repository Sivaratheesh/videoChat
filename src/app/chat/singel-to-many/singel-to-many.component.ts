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
  roomJoiniees: any = [];
  roomJoinieesice: any = [];
  peers:any = {};
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

  // ngOnInit(): void {
  //   if(sessionStorage.getItem('rtcCode')){
  //     this.roomId = sessionStorage.getItem('rtcCode');
  //   }else{
  //     this.router.navigate(['app']);
  //   }
  //   this.spinner.show();
  //   this.localId =  document.getElementById("localVideo")
  //   this.remoteId  =  document.getElementById("remoteVideo")
  //   this.localVideo = document.getElementById("localLocal");
  //   this.remoteVideo = document.getElementById("localRemote");
  //   this.remoteLocal = document.getElementById("remoteLocal");
  //   this.remoteRemote = document.getElementById("remoteRemote");
  //   this.socketService.room_created.subscribe((even: any) => {
  //     console.log("room done", even);
  //     this.isRoomCreator = true
  //   })
  //   this.socketService.room_joined.subscribe((even: any) => {
  //     console.log('joined', even);

  //     this.socketService.startCall(this.roomId)
  //   })
  //   this.socketService.start_Call.subscribe(async (event: any) => {
  //     console.log("start", event);
  //     // this.remoteID= event;
  //     let id = this.socketService.socket.ioSocket.id
  //     // id = id.replaceAll(/\s/g,'');le
  //     let newid = ''
  //     if (id) {
  //       // if(this.localConnection && this.localConnection.length && !this.localConnection.some(connection => connection[id] === id )){
  //       //   this.localConnection.push ({ [id]: { peer: await new RTCPeerConnection(this.iceServers) }, id:id });
  //       //   newid = id
  //       // }else if (this.localConnection.length===0) {
  //       //   newid = id
  //         this.localConnection.push ({ [id]: { peer: await new RTCPeerConnection(this.iceServers) }, id:id });
  //       // }
  //       // if(newid !== ''){
  //         let connection =  this.localConnection.find((con:any) => con.id === id)
  //         this.localStream.getTracks().forEach((track: any) => {
  //          connection[id].peer.addTrack(track, this.localStream);
  //         });
  //         const remStream:any = new MediaStream();
  //           const remoteVideo: any = document.getElementById("remote");
  //         var v = document.createElement ("video");
  //         v.srcObject = remStream;
  //         v.controls = false;
  //         v.autoplay = true;
  //         v.playsInline = true;
  //         v.loop =true;
  //         v.muted = true;
  //         v.width=200;
  //         v.height=300;
  //         remoteVideo.appendChild (v);
  //         // const connection =  this.localConnection.find((con:any) => con.id === id)
  
  //         connection[id].peer.addEventListener('track', async (event: any) => {
  //           remStream.addTrack(event.track, remStream);
  //         });
          
  //         connection[id].peer.onicecandidate = (event: any) => {
  //           if (event.candidate) {
  //             let data = {
  //               roomId: this.roomId,
  //               label: event.candidate.sdpMLineIndex,
  //               candidate: event.candidate.candidate,
  //               id: id
  //             }
  //             this.socketService.webrtc_ice_candidate(data)
  
  //           }
  //         }
  //         connection[id].peer.createOffer().then((off:any)=>{
  //           connection[id].peer.setLocalDescription(off).then(async (res:any)=>{
  //             let offerObj = {
  //               type: 'webrtc_offer',
  //               sdp: off,
  //               roomId: this.roomId,
  //               id: id,
  //               ansId: this.socketService.socket.ioSocket.id,
  //               offId: event
      
  //             }
  //             await this.socketService.webrtc_offer_mm(offerObj);
  //           })
  //         });
  //       // }
  //       // await this.localConnection[id].peer.setLocalDescription(offer);
  //       // let offerObj = {
  //       //   type: 'webrtc_offer',
  //       //   sdp: offer,
  //       //   roomId: this.roomId,
  //       //   id: id

  //       // }
  //       // await this.socketService.webrtc_offer(offerObj);
  //     }

  //   })

  //   this.socketService.webrtc_offers_mm.subscribe(async (event: any) => {
  //     let id = event.id
  //     if ( event ) {
  //       console.log("offer", event);
  //       this.myId = event.id;
    
  //       for(const remoteid of event.ids){
  //         let newId = ''
  //         if(this.localConnection && this.localConnection.length && !this.localConnection.some(connection => connection[id] === remoteid )){
  //           newId = remoteid
  //           this.localConnection.push ({ [remoteid]: { peer: await new RTCPeerConnection(this.iceServers) }, id:remoteid });
  //         }else if (this.localConnection.length===0){
  //           newId = remoteid
  //           this.localConnection.push ({ [remoteid]: { peer: await new RTCPeerConnection(this.iceServers) }, id:remoteid });
  //         }
  //         if(newId !== ''){
  //           let connection =  this.localConnection.find((con:any) => con.id === remoteid)
  //           this.localStream.getTracks().forEach((track: any) => {
  //             connection[remoteid].peer.addTrack(track, this.localStream);
  //           });
  //          const remStream:any = new MediaStream();
  //             const remoteVideo: any = document.getElementById("remote");
  //           var v = document.createElement ("video");
  //           v.srcObject = remStream;
  //           v.controls = false;
  //           v.autoplay = true;
  //           v.playsInline = true;
  //           v.loop =true;
  //           v.muted = true;
  //           v.width=200;
  //           v.height=300;
  //           remoteVideo.appendChild (v);
  //           // const connection =  this.localConnection.find((con:any) => con.id === id)
    
  //           connection[remoteid].peer.addEventListener('track', async (event: any) => {
  //             remStream.addTrack(event.track, remStream);
  //           });
  //           connection[remoteid].peer.onicecandidate = (event: any) => {
  //             if (event.candidate) {
  //               let data = {
  //                 roomId: this.roomId,
  //                 label: event.candidate.sdpMLineIndex,
  //                 candidate: event.candidate.candidate,
  //                 id: remoteid
  //               }
  //               this.socketService.webrtc_ice_candidate(data);
  //             }
  //           }
  //           await connection[remoteid].peer.setRemoteDescription(new RTCSessionDescription(event.sdp));
  //           // if(this.localConnection[id].peer){
  //             connection[remoteid].peer.createAnswer().then( (ans:any) =>{
  //               connection[remoteid].peer.setLocalDescription(ans).then( async (res:any)=>{
  //                 let offerObj = {
  //                   type: 'webrtc_answer',
  //                   sdp: ans,
  //                   roomId: this.roomId,
  //                   id:this.myId,
  //                   ansId: event.ansId,
  //                 }
  //                 await this.socketService.webrtc_ans_mm(offerObj);
  //               this.localVideo.style.display = "block";
  //               this.spinner.hide();
  //               })
  //             });
  //         }
         
  //       }
       
  //       //   await this.localConnection[id].peer.setLocalDescription(answer);
  //       //   let offerObj = {
  //       //     type: 'webrtc_answer',
  //       //     sdp: answer,
  //       //     roomId: this.roomId,
  //       //     id:this.myId 
  //       //   }
  //       //   await this.socketService.webrtc_answer_sm(offerObj);
  //       // this.localVideo.style.display = "block";
  //       // this.spinner.hide();
  //       // }


  //     }
  //   })
  //   this.socketService.webrtc_anssm_mm.subscribe((event: any) => {
  //     let id = event.id;
  //     let remoteids:any = [];
  //     if(this.roomJoiniees.length){
  //       event.ids.forEach((data:any)=>{
  //       const existing = this.roomJoiniees.find((id:any)=> id === data);
  //       if(!existing){
  //         remoteids.push(data);
  //         this.roomJoiniees.push(data)
  //       }
  //       })

  //     }else{
  //       this.roomJoiniees = event.ids;
  //     }

  //     for(const remoteid of remoteids){
  //       const connection =  this.localConnection.find((con:any) => con.id === id)

  //       console.log("answer", event);
  //       if (event.id && connection ) {
  //         // this.iceCandi = event.id
  
  //         connection[remoteid].peer.setRemoteDescription(new RTCSessionDescription(event.sdp));
  //         this.localVideo.style.display = "block";
  //         // this.spinner.hide();
  //       this.spinner.hide();
         
  //       }
  //     }
     
  //   })
  //   this.socketService.webrtc_ice_candidates.subscribe((event: any) => {
  //     let id = event.id
  //     let remoteids:any = [];
  //     if(this.roomJoinieesice.length){
  //       event.ids.forEach((data:any)=>{
  //       const existing = this.roomJoinieesice.find((id:any)=> id === data);
  //       if(!existing){
  //         remoteids.push(data);
  //         this.roomJoinieesice.push(data)
  //       }
  //       })

  //     }else{
  //       this.roomJoinieesice = event.ids;
  //     }
  //     for(const remoteid of remoteids){
  //       const connection =  this.localConnection.find((con:any) => con.id === remoteid)
   
  //       if (event.candidate && connection && connection[remoteid]) {
  //         // this.iceCandi = remoteid
  //         let candidate = new RTCIceCandidate({
  //           sdpMLineIndex: event.label,
  //           candidate: event.candidate,
  //         })
  //         console.log("ice", event);
  //         console.log("ice", connection[remoteid]);
  //         connection[remoteid].peer.addIceCandidate(candidate);
  //       }
  //     }
     
  //   })
  //   this.joinRoom();
  // }
  // public async joinRoom() {
  //   if (this.roomId.length) {
  //     this.localVideo.style.display = "none"
  //     await this.socketService.createRoom_mm({roomId:this.roomId,id:this.socketService.socket.ioSocket.id});
  //     const constraints = { 'video': true, 'audio': { 'echoCancellation': true }, };
  //     const stream = await navigator.mediaDevices.getUserMedia(constraints);
  //     if(stream){
  //       this.localVideo.controls = false;
  //       this.localVideo.muted = true;
  //       this.localVideo.srcObject = stream;
  //       this.localVideo.volume = 0;
  //       this.localStream = stream;
  //       this.localVideo.width=200;
  //       this.localVideo.height=300;
  //     }
     
  //   }
  // }
  public logOut() {
    this.socketService.OfflineUser(this.user);
    localStorage.clear();
    this.router.navigate(['/']);
  }
  public onClick() {
    this.onTabClick = this.onTabClick === true ? false : true;
  }
  async ngOnInit() {
    // this.roomId = uuidv4();
        if(sessionStorage.getItem('rtcCode')){
      this.roomId = sessionStorage.getItem('rtcCode');
     await this.socketService.socket.emit('joinRoom_MM',this.roomId)
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

    this.socketService.socket.on('userJoined_MM', (users: string[]) => {
      this.handleUserJoined(users);
    });

    this.socketService.socket.on('userLeft_MM', (users: string[]) => {
      this.handleUserLeft(users);
    });

    this.socketService.socket.on('offer_MM', (payload:any) => {
      this.handleOffer(payload);
    });

    this.socketService.socket.on('answer_MM', (payload:any) => {
      this.handleAnswer(payload);
    });

    this.socketService.socket.on('ice-candidate_MM', (candidate:any) => {
      this.handleIceCandidate(candidate);
    });
  }

  async initLocalStream() {
    if (this.roomId.length) {
          this.localVideo.style.display = "none"
          // await this.socketService.createRoom_mm({roomId:this.roomId,id:this.socketService.socket.ioSocket.id});
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
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //   .then(stream => {
    //     this.localStream = stream;
    //   })
    //   .catch(error => {
    //     console.error('Error accessing media devices:', error);
    //   });
  }
  }
  handleUserJoined(users: string[]) {
    users.forEach(async userId => {
     await this.createPeerConnection(userId, true);
    });
  }

  handleUserLeft(users: string[]) {
    users.forEach(userId => {
      this.peers[userId].close();
      delete this.peers[userId];
    });
  }

   async createPeerConnection(userId: string, isOfferer: boolean) {
    // this.localConnection.push ({ [userId]: { peer: await new RTCPeerConnection(this.iceServers) }, id:id });
    const peer = await new RTCPeerConnection(this.iceServers);
 

    if (isOfferer) {
      this.localStream.getTracks().forEach((track:any) => {
        peer.addTrack(track, this.localStream);
      });
    }
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
            peer.addEventListener('track', async (event: any) => {
                        remStream.addTrack(event.track, remStream);
                      });
    // peer.ontrack = (event) => {
    //   const remoteVideo = document.createElement('video');
    //   remoteVideo.srcObject = event.streams[0];
    //   remoteVideo.autoplay = true;
    //   document.body.appendChild(remoteVideo);
    // };
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.socket.emit('ice-candidate_MM', { target: userId,label: event.candidate.sdpMLineIndex,candidate: event.candidate.candidate });
      }
    };

    // if (isOfferer) {
      peer.createOffer()
        .then(async offer => {
         await peer.setLocalDescription(offer);
          this.socketService.socket.emit('offer_MM', { offer, target: userId });
        })
        .catch(error => {
          console.error('Error creating offer:', error);
        });
    // } else {
      this.peers[userId] = peer;
    // }
  }

  async handleOffer(payload:any) {
    const { offer, target } = payload;
    const peer = await new RTCPeerConnection(this.iceServers);
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
              peer.addEventListener('track', async (event: any) => {
                            remStream.addTrack(event.track, remStream);
                          });        
    peer.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.socketService.socket.emit('ice-candidate_MM', { target, label: event.candidate.sdpMLineIndex,candidate: event.candidate.candidate  });
      }
    };

    // peer.ontrack = (event) => {
    //   const remoteVideo = document.createElement('video');
    //   remoteVideo.srcObject = event.streams[0];
    //   remoteVideo.autoplay = true;
    //   document.body.appendChild(remoteVideo);
    // };
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
              // if(this.localConnection[id].peer){
                peer.createAnswer().then( async (ans:any) =>{
                 await peer.setLocalDescription(ans).then( async (res:any)=>{
                  await this.socketService.socket.emit('answer_MM', { answer:ans, target });
                  this.localVideo.style.display = "block";
                  this.spinner.hide();
                  })
                });
    // peer.setRemoteDescription(new RTCSessionDescription(offer));
    //   // .then(() => 
    //   peer.createAnswer()
    //   .then(ans => peer.setLocalDescription(ans))
    //   .then((res) => {
    //     this.socketService.socket.emit('answer_MM', { answer:ans, target });
    //     this.localVideo.style.display = "block";
    //                   this.spinner.hide();
    //   })
    //   .catch(error => {
    //     console.error('Error handling offer:', error);
    //   });

    this.peers[target] = peer;
  }

  async handleAnswer(payload:any) {
    const { answer, target } = payload;
    this.peers[target].setRemoteDescription(await new RTCSessionDescription(answer))
      .catch((error:any) => {
        console.error('Error handling answer:', error);
      });
      this.localVideo.style.display = "block";
              this.spinner.hide();
  }

  async handleIceCandidate(candidate:any) {
    let candidates = new RTCIceCandidate({
                sdpMLineIndex: candidate.label,
                candidate: candidate.candidate,
              })
              // connection[remoteid].peer.addIceCandidate(candidate);
    await this.peers[candidate.target].addIceCandidate(candidates)
      .catch((error:any) => {
        console.error('Error handling ICE candidate:', error);
      });
  }

}
