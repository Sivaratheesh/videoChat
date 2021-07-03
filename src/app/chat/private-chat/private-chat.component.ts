import { ThisReceiver } from '@angular/compiler';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss']
})
export class PrivateChatComponent implements OnInit {

  public users: any[] = []
  public IsMicEnable: boolean = true;
  public IsMicEnablePublic: boolean = true;
  public userName: any;
  public userNameText: any;
  public user: any;
  onTabClick: boolean = false;
  public publicMessage: any[] = [];
  @ViewChild('expandButton', { static: false }) expandButton: any = ElementRef;
  @ViewChild('scrollframe', { static: false }) scrollFrame: any = ElementRef;
  @ViewChild('scrollframePrivate', { static: false }) scrollFramePrivate: any = ElementRef;


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
  broadcasterId: any;
  myId: any;
  constructor(private router: Router, private renderer: Renderer2, private socketService: SocketService, private apiservice: ApiserviceService) {
    if (this.apiservice.getLocalStorage('user')) {
      this.user = this.apiservice.getLocalStorage('user');
      this.socketService.iAmInOnline(this.user);
    } else {
      alert('Please login');
      this.router.navigate(['/'])
    }
    // this.socketService.receiveMessage.subscribe(data => {
    //   this.publicMessage.push(data);
    //   this.apiservice.setLocalStorage('message', this.publicMessage);
    // })
    this.socketService.roomEvent.subscribe(data => {
      this.publicMessage.push(data);
      this.apiservice.setLocalStorage('message', this.publicMessage);
    })
    if (this.apiservice.getLocalStorage('message')) {
      this.publicMessage = this.apiservice.getLocalStorage('message')
    }
    this.socketService.roomVideo.subscribe(track => {
      console.log(track);
      const remoteVideo: any = document.getElementById("remote");
      remoteVideo.srcObject = track;
    })
    this.socketService.offer.subscribe(async (data: any) => {

      if (data && !this.declineAllCall && !this.requestData) {
        if (data.receiver.email == this.user.email) {
          this.requestData = data;
          // await this.localConnection.setRemoteDescription(data.answer);
          //   const remoteStream:any = new MediaStream();
          //   const remoteVideo:any = document.getElementById("remote");
          //   remoteVideo.srcObject = remoteStream;
          //   this.localConnection.addEventListener('track', async (event:any) => {
          //     remoteStream.addTrack(event.track, remoteStream);
          //     console.log(remoteStream)
          // });
          await this.localConnection.setRemoteDescription(data.offer);
          this.createanswer = true;
          return;
        }
      } else {
        data.return = true;
        this.socketService.alreadyConnected(data);
      }
    });

    this.socketService.answer.subscribe(async (data: any) => {

      if (data) {
        if (data.sender.id == this.user.id) {
          this.requestData = data;
          const remoteStream: any = new MediaStream();
          const remoteVideo: any = document.getElementById("remote");
          remoteVideo.srcObject = remoteStream;
          this.localConnection.addEventListener('track', async (event: any) => {
            remoteStream.addTrack(event.track, remoteStream);
            console.log(remoteStream)
          });
          await this.localConnection.setRemoteDescription(data.answer);
          let name = this.requestData.receiver.name.trim();
          this.requestData.receiver.userNameText = name.charAt(0).toUpperCase();
          this.isRequestAccepted = true;
          this.blockRequest = true;
          this.hangUpbtn = true;
        }
      }
    })
    this.socketService.anOtherCall.subscribe((data: any) => {
      if (data) {
        if (data.sender.id == this.user.id && data.return != true) {
          this.localConnection.close();
          if (this.remoteConnection) {
            this.remoteConnection.close();
          }
          this.localConnection = null;
          this.remoteConnection = null;
          this.channel.close();
          this.channel = null
          this.hangUpbtn = false;
          this.isRequestAccepted = false;
          this.declineAllCall = false;
          this.blockRequest = false;
          this.isAccepted = false;
          this.requestData = '';
          this.privateMessage = [];
          this.createConnection();
          console.log("Connected with other peer")
        }
      }
    })
  }

  ngOnInit(): void {
    // this.createConnection();
    this.scrollToBottom();
    let name = this.user.name.trim();
    this.userNameText = name.charAt(0).toUpperCase();
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.onTabClick === true) {
        if (e.target !== this.expandButton.nativeElement) {
          this.onTabClick = false;
        }
      }
    });
    this.socketService.onlineUser.subscribe((data: any) => {
      if (data.users) {
        this.users = data.users;
        this.users.forEach(x => {
          let name = x.name.trim();
          x.profileText = name.charAt(0).toUpperCase();
        });
      }
    });
    this.socketService.onlineUsers.subscribe((data: any) => {
      if (data.users) {
        this.users = data.users;
        this.users.forEach(x => {
          let name = x.name.trim();
          x.profileText = name.charAt(0).toUpperCase();
        });
      }
    });

    this.apiservice.getAllOnlineuser(this.user.id).subscribe((data: any) => {
      if (data.result == 'success') {
        this.users = data.users;
        this.users.forEach(x => {
          let name = x.name.trim();
          x.profileText = name.charAt(0).toUpperCase();
        });
      } else if (data.result == 'invalid') {
        alert('Please login again');
        this.router.navigate(['/'])
      }
    });
    this.socketService.hangupCall.subscribe((data: any) => {
      if (data && this.requestData) {
        if (data.sender.id == this.requestData.sender.id) {
          this.localConnection.close();
          if (this.remoteConnection) {
            this.remoteConnection.close();
          }
          this.localConnection = null;
          this.remoteConnection = null;
          this.hangUpbtn = false;
          this.isRequestAccepted = false;
          this.blockRequest = false;
          this.isAccepted = false;
          this.declineAllCall = false;
          this.requestData = '';
          this.privateMessage = [];
          // this.createConnection();
        }
      }
    })
    this.socketService.room_created.subscribe((even: any) => {
      console.log("room done", even);
      this.isRoomCreator = true
    })
    this.socketService.room_joined.subscribe((even: any) => {
      console.log('joined', even);

      this.socketService.startCall(this.roomId)
    })
    this.socketService.start_Call.subscribe(async (event: any) => {
      // if(!this.broadcasterId){
      //   this.broadcasterId=event;
      // }
      console.log("start", event);
        let id = event;
      if (this.isRoomCreator &&  id) {
      // this.localConnection[id] = {};

        this.localConnection = {[id]: {peer: await new RTCPeerConnection(this.iceServers)}};
        this.localStream.getTracks().forEach((track: any) => {
          this.localConnection[id].peer.addTrack(track, this.localStream);
        });
        // const remoteStream: any = new MediaStream();
        const remoteVideo: any = document.getElementById("remote");
        var v = document.createElement ("video");
        v.srcObject = this.remoteStream;
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        v.loop =true;
        v.muted = true;
        remoteVideo.appendChild (v);
        this.remoteStream = null;
        // remoteVideo.srcObject = this.remoteStream;
        this.localConnection[id].peer.addEventListener('track', async (event: any) => {
          this.remoteStream.addTrack(event.track, this.remoteStream);
          // console.log(remoteStream)
        });
        this.localConnection[id].peer.onicecandidate = (event: any) => {
          if (event.candidate) {
            let data = {
              roomId: this.roomId,
              label: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
              id:id

            }
            this.socketService.webrtc_ice_candidate(data)
            // socket.emit('webrtc_ice_candidate', {

            // })
          }
        }
        const offer = await this.localConnection[id].peer.createOffer();
        await this.localConnection[id].peer.setLocalDescription(offer);
        let offerObj = {
          type: 'webrtc_offer',
          sdp: offer,
          roomId: this.roomId,
          id:id
        }
        await this.socketService.webrtc_offer(offerObj);
      }

    })

    this.socketService.webrtc_offers.subscribe(async (event: any) => {

      if (!this.isRoomCreator && event && !this.myId) {
        console.log("offer", event);
        this.myId = event.id;
      let id = event.id
      // this.localConnection[id] = {}
      this.localConnection = {[id]: {peer: await new RTCPeerConnection(this.iceServers)}};
        this.localStream.getTracks().forEach((track: any) => {
          this.localConnection[id].peer.addTrack(track, this.localStream);
        });
        console.log("2")
        // const remoteStream: any = new MediaStream();
        // const remoteVideo: any = document.getElementById("remote");
        // remoteVideo.srcObject = this.remoteStream;
        // this.localConnection[id].peer.addEventListener('track', async (event: any) => {
        //   this.remoteStream.addTrack(event.track, this.remoteStream);
      
        // });
        console.log("2")
        this.localConnection[id].peer.onicecandidate = (event: any) => {
          if (event.candidate) {
            let data = {
              roomId: this.roomId,
              label: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
              id:id
            }
            this.socketService.webrtc_ice_candidate(data)
            // socket.emit('webrtc_ice_candidate', {

            // })
          }
        }
        await this.localConnection[id].peer.setRemoteDescription(new RTCSessionDescription(event.sdp));
        const answer = await this.localConnection[id].peer.createAnswer();
        await this.localConnection[id].peer.setLocalDescription(answer);
        let offerObj = {
          type: 'webrtc_answer',
          sdp: answer,
          roomId: this.roomId,
          id:id

        }
        await this.socketService.webrtc_answer(offerObj);

        // console.log("answer", answer)
      }

    })
    this.socketService.webrtc_answers.subscribe( (event: any) => {
      let id = event.id
      console.log("answer", event);
      if (event && !this.myId) {
        this.localConnection[id].peer.setRemoteDescription(new RTCSessionDescription(event.sdp));

      }

    })
    this.socketService.webrtc_ice_candidates.subscribe((event: any) => {
      let id = event.id
      console.log("ice", event);
      console.log("ice", this.localConnection[id]);

      // console.log("ice", id);

      if (event.candidate && this.localConnection[id]) {
        let candidate = new RTCIceCandidate({
          sdpMLineIndex: event.label,
          candidate: event.candidate,
        })
        this.localConnection[id].peer.addIceCandidate(candidate);
      }

    })
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  public sentEnable(value: any) {
    if (value == 'public' && this.localMsg) {
      if (this.localMsg.length > 0) {
        this.IsMicEnablePublic = false
      }
    } else if (this.webRTCMsg && this.channel) {
      if (this.webRTCMsg.length > 0) {
        this.IsMicEnable = false;
      }
    } else if (this.webRTCMsg == "") {

      this.IsMicEnable = true;

    } else if (value == 'public' && this.localMsg == "") {

      this.IsMicEnablePublic = true

    }
  }
  private scrollToBottom(): void {
    try {
      this.scrollFrame.nativeElement.scrollTop = this.scrollFrame.nativeElement.scrollHeight;
      this.scrollFramePrivate.nativeElement.scrollTop = this.scrollFramePrivate.nativeElement.scrollHeight;

    } catch (err) { }
  }
  public sentDisable(value: any) {
    if (value == 'public') {
      // this.IsMicEnablePublic = true
    } else {
      // this.IsMicEnable = true;
    }
  }
  public onClick() {
    this.onTabClick = this.onTabClick === true ? false : true;
  }
  public logOut() {
    this.socketService.OfflineUser(this.user);
    // this.apiservice.logOutUser(this.user);
    localStorage.clear();
    this.router.navigate(['/']);
  }
  // public sendPublicMessage() {

  //   let message = {
  //     message: this.localMsg,
  //     user: this.user
  //   }
  //   this.socketService.sendMessage(message);
  //   this.publicMessage.push(message);
  //   this.apiservice.setLocalStorage('message', this.publicMessage);
  //   this.localMsg = '';
  //   this.IsMicEnablePublic = true


  // }

  public sendPublicMessage() {

    let message = {
      message: this.localMsg,
      user: this.user,
      room: this.roomId
    }
    this.socketService.roomMessage(message);
    this.publicMessage.push(message);
    this.apiservice.setLocalStorage('message', this.publicMessage);
    this.localMsg = '';
    this.IsMicEnablePublic = true

  }
  public createConnection() {
    this.localConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    console.log('Created local peer connection object localConnection');
    this.localConnection.ondatachannel = (event: any) => {
      console.log('ondatachannel');
      this.channel = event.channel;
      console.log(this.channel);
      // this.data.push(event.data);
      this.remoteConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      console.log('Created remote peer connection object remoteConnection');
    }
  }
  public async createOffer(data: any) {

    this.sendChannel = this.localConnection.createDataChannel('sendDataChannel');
    this.sendChannel.onmessage = (event: any) => {
      let message = {
        user: this.requestData.receiver,
        message: event.data
      }
      this.privateMessage.push(message);
      console.log("Got Data Channel Message:", event.data);
      // };
      // this.channel = this.localConnection.createDataChannel('data');
      // this.channel.onmessage = (event: any) => {
      //   // alert(event.data)
      //   this.data.push(event.data); 
    };
    this.localConnection.onicecandidate = (event: any) => {
      // console.log('onicecandidate', event)
      if (!event.candidate) {
        this.offer = this.localConnection.localDescription;
        let obj = {
          sender: this.user,
          receiver: data,
          offer: this.offer
        }
        this.socketService.sendOffer(obj);
        this.hangUpbtn = true;
        console.log(JSON.stringify(this.offer));
      }
    }
    //   const constraints = { 'video': true, 'audio': {'echoCancellation': true}, };
    //   const stream = await navigator.mediaDevices.getUserMedia(constraints);
    //   const localVideo:any = document.getElementById("local");
    //   localVideo.srcObject = stream;
    // localVideo.volume = 0;
    //   const localStream = stream;
    //   console.log(localStream);
    //   localStream.getTracks().forEach(track => {
    //     this.localConnection.addTrack(track, localStream);
    // });
    const offer = this.localConnection.createOffer();
    await this.localConnection.setLocalDescription(offer);

  }
  // public async getUserMedia():any {
  //   try {
  //     const constraints = { 'video': true, 'audio': true };
  //     const stream = await navigator.mediaDevices.getUserMedia(constraints);
  //     return stream;
  //   } catch (error) {
  //     console.error('Error opening video camera.', error);
  //   }
  // }
  public async createAnswer() {
    // this.channel.onmessage = (event: any) => alert(event.data);
    this.hangUpbtn = true;
    this.localConnection.onicecandidate = (event: any) => {
      // console.log('onicecandidate', event)
      if (!event.candidate) {
        this.answer = this.localConnection.localDescription;
        this.requestData.answer = this.answer;
        this.socketService.sendAnswer(this.requestData);

        console.log(JSON.stringify(this.answer));
      }
    }
    const constraints = { 'video': true, 'audio': { 'echoCancellation': true }, };
    const mediaDevices = navigator.mediaDevices as any;
    const stream = await mediaDevices.getDisplayMedia({ video: true });
    // const stream = await   navigator.mediaDevices.getDisplayMedia({video: true})
    // const localVideo:any = document.getElementById("local");
    // localVideo.volume = 0;
    // document.getElementById("local").volume = 0
    // localVideo.srcObject = stream;
    const localStream = stream;
    console.log(localStream);
    localStream.getTracks().forEach((track: any) => {
      this.localConnection.addTrack(track, localStream);
    });
    const answer = this.localConnection.createAnswer();
    await this.localConnection.setLocalDescription(answer);
    let name = this.requestData.sender.name.trim();
    this.requestData.sender.userNameText = name.charAt(0).toUpperCase();
    this.isAccepted = true;
    this.blockRequest = true;
    this.createanswer = false;
    this.declineAllCall = true;
    if (!this.channel) {
      this.sendChannel = this.localConnection.createDataChannel('sendDataChannel');
      this.sendChannel.onmessage = (event: any) => {
        let message = {
          user: this.requestData.sender,
          message: event.data
        }
        this.privateMessage.push(message);

        // this.data.push(event.data);
        console.log("Got Data Channel Message:", event.data);
      };

    }
  }

  public sendPrivateMessage() {

    const text = this.webRTCMsg;
    let message = {
      message: this.webRTCMsg,
      user: this.user
    }
    if (this.channel) {
      this.channel.send(this.webRTCMsg);
      this.privateMessage.push(message);
      this.webRTCMsg = '';
      this.IsMicEnable = true;
    }

  }
  public hangUp() {
    this.localConnection.close();
    if (this.remoteConnection) {
      this.remoteConnection.close();
    }
    this.localConnection = null;
    this.remoteConnection = null;
    this.channel.close();
    this.channel = null
    this.socketService.hangUp(this.requestData);
    this.hangUpbtn = false;
    this.isRequestAccepted = false;
    this.declineAllCall = false;
    this.blockRequest = false;
    this.isAccepted = false;
    this.requestData = '';
    this.privateMessage = [];
    this.createConnection();
  }
  public async joinRoom() {
    if (this.roomId.length) {
      await this.socketService.createRoom(this.roomId);
      const constraints = { 'video': true, 'audio': { 'echoCancellation': true }, };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const localVideo: any = document.getElementById("local");
      localVideo.srcObject = stream;
      localVideo.volume = 0;
      this.localStream = stream;
      // this.socketService.videoService(localStream);

    }
  }
}




