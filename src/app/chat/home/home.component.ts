import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public users: any[] = [
    // { name: "Ratheesh",email:"ratheesh93.ngl@gmail.com" },
    // { name: "Magesh",email:"ratheesh93.ngl@gmail.com"  },
    // { name: "Suresh",email:"ratheesh93.ngl@gmail.com"  },
    // { name: "Siva" ,email:"ratheesh93.ngl@gmail.com" },
    // { name: "Kumar",email:"ratheesh93.ngl@gmail.com"  },
    // { name: "Thanaraj",email:"ratheesh93.ngl@gmail.com"  },
    // { name: "Ratheesh",email:"ratheesh93.ngl@gmail.com"  },
    // { name: "Magesh",email:"ratheesh93.ngl@gmail.com"  },
    // { name: "Suresh",email:"ratheesh93.ngl@gmail.com"  },
    // { name: "Siva" ,email:"ratheesh93.ngl@gmail.com" },
    // { name: "Kumar" ,email:"ratheesh93.ngl@gmail.com" },
    // { name: "Thanaraj",email:"ratheesh93.ngl@gmail.com"  },
  ]
  public IsMicEnable: boolean = true;
  public IsMicEnablePublic: boolean = true;
  public userName:any;
  public userNameText:any
  onTabClick: boolean = false;
  @ViewChild('expandButton',{static: false}) expandButton:any = ElementRef;
  constructor( private router:Router,private renderer: Renderer2, private socketService:SocketService) { this.userName = "Siva Ratheesh"}

  ngOnInit(): void {
    let name = this.userName .trim();
      this.userNameText = name.charAt(0).toUpperCase();
    this.users.forEach(x => {
      let name = x.name.trim();
      x.profileText = name.charAt(0).toUpperCase();
    });
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.onTabClick === true) {
        if (e.target !== this.expandButton.nativeElement) {
          this.onTabClick = false;
        }
      }
    });
    this.socketService.onlineUser.subscribe(data =>{
      this.users.push(data);
    })

  }
  public sentEnable(value: any) {
    if (value == 'public') {
      this.IsMicEnablePublic = false
    } else {
      this.IsMicEnable = false;
    }
  }
  public sentDisable(value: any) {
    if (value == 'public') {
      this.IsMicEnablePublic = true
    } else {
      this.IsMicEnable = true;
    }
  }
public onClick() {
  this.onTabClick = this.onTabClick === true ? false : true;
}
public logOut(){
this.router.navigate(['/']);
}

}
