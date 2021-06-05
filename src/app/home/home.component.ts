import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public width = 320;    // We will scale the photo width to this
  public height = 0;     // This will be computed based on the input stream

  public streaming = false;

  public cameraSrc:any;
  public canvas:any;
  public photo :any;
  public startbutton = null;

  constructor( public videoseervice:VideoService,private apiservice:ApiserviceService) { }

  ngOnInit(): void {
    // let cameraSrc = <HTMLVideoElement>document.querySelector('video');
    // this.videoseervice.video =  cameraSrc
    // this.videoseervice.getvideo();
    this.apiservice.getIssues().subscribe(data =>{
      console.log(data);
      
    })
    this.apiservice.getuseer().subscribe(data =>{
      console.log(data);
      
    })
  }
}
