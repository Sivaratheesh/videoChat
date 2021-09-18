import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public singleRoomId:any;
  public manyRoomId:any;
  public user: any;
  public userNameText: any;
  public onTabClick: boolean | any;

  constructor(private router:Router,private apiservice: ApiserviceService,private socketService: SocketService) { 
    if (this.apiservice.getLocalStorage('user')) {
      this.user = this.apiservice.getLocalStorage('user');
      this.socketService.iAmInOnline(this.user);
    } else {
      alert('Please login');
      this.router.navigate(['/'])
    }
  }

  ngOnInit(): void {
  }
  public oneToOneRoom(){
    if(this.singleRoomId && this.singleRoomId.length >= 3){
      sessionStorage.setItem('rtcCode',this.singleRoomId);
      this.router.navigate(['app/one2one'])
    }

  }
  public manyToOneRoom(){
    if(this.manyRoomId && this.manyRoomId.length >= 3){
      sessionStorage.setItem('rtcCode',this.manyRoomId);
      this.router.navigate(['app/many2one'])
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
