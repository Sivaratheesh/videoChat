import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public users: any[] = [
    { name: "Ratheesh" },
    { name: "Magesh" },
    { name: "Suresh" },
    { name: "Siva" },
    { name: "Kumar" },
    { name: "Thanaraj" },
    { name: "Ratheesh" },
    { name: "Magesh" },
    { name: "Suresh" },
    { name: "Siva" },
    { name: "Kumar" },
    { name: "Thanaraj" },
  ]
  public IsMicEnable: boolean = true;
  public IsMicEnablePublic: boolean = true;
  public userName:any;
  public userNameText:any
  onTabClick: boolean = false;
  @ViewChild('expandButton',{static: false}) expandButton:any = ElementRef;
  constructor( private router:Router,private renderer: Renderer2) { this.userName = "Siva Ratheesh"}

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
