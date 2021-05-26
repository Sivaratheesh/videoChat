import { Component, OnInit } from '@angular/core';
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

  constructor( public videoseervice:VideoService) { }

  ngOnInit(): void {
    this.cameraSrc = document.getElementById('video');
    this.videoseervice.video =  this.cameraSrc
    this.videoseervice.getvideo();
  }
}
