import { ThisReceiver } from '@angular/compiler';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  public users: any[] = []
  public IsMicEnable: boolean = true;
  public IsMicEnablePublic: boolean = true;
  public userName: any;
  public userNameText: any
  public user: any
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
  constructor(private router: Router, private renderer: Renderer2, private socketService: SocketService, private apiservice: ApiserviceService) {
    if (this.apiservice.getLocalStorage('user')) {
      this.user = this.apiservice.getLocalStorage('user');
      console.log(this.user)
    } else {
      alert('Please login');
      this.router.navigate(['/'])
    }
    this.socketService.receiveMessage.subscribe(data => {
      this.publicMessage.push(data);
      this.apiservice.setLocalStorage('message', this.publicMessage);
    })
    if (this.apiservice.getLocalStorage('message')) {
      this.publicMessage = this.apiservice.getLocalStorage('message')
    }
    this.socketService.offer.subscribe(async (data: any) => {

      if (data && !this.declineAllCall && !this.requestData) {
        if (data.receiver.email == this.user.email) {
          console.log(data)
          this.requestData = data;
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
          console.log(data)
          this.requestData = data;
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
    this.createConnection();
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
      console.log(data);
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
        console.log(data.users);
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
          this.createConnection();
        }
      }
    })
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  public sentEnable(value: any) {
    if (value == 'public') {
      this.IsMicEnablePublic = false
    } else {
      this.IsMicEnable = false;
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
    this.apiservice.logOutUser(this.user);
    localStorage.clear();
    this.router.navigate(['/']);
  }
  public sendPublicMessage() {
    let message = {
      message: this.localMsg,
      user: this.user
    }
    this.socketService.sendMessage(message);
    console.log(message)
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
    const offer = this.localConnection.createOffer();
    await this.localConnection.setLocalDescription(offer);

  }

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
    console.log(message)
    this.channel.send(this.webRTCMsg);
    this.privateMessage.push(message);
    this.webRTCMsg = '';
    this.IsMicEnable = true;
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
}
