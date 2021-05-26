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

  public video:any;
  public canvas:any;
  public photo :any;
  public startbutton = null;

  constructor( public videoseervice:VideoService) { }

  ngOnInit(): void {
    this.videoseervice.video = document.getElementById('video');
    this.videoseervice.getvideo();
    // this.canvas = document.getElementById('canvas');
    // this.photo = document.getElementById('photo');
    // this.startbutton = document.getElementById('startbutton');

    // navigator.mediaDevices
    // .getUserMedia({
    //   video: {
    //     facingMode: 'environment'
    //   },audio:true
    // })
    // .then((stream) => {
    //   this.video.srcObject = stream;
    //   this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
    //   this.video.play();
    //  this.video.getVideoTracks();
    //   // let url = window.URL.createObjectURL(stream);
    //   // console.log(url)
    // })
    // .catch(function(err) {
    //     console.log("An error occurred: " + err);
    // });
    // this.video.addEventListener('canplay', function(ev){
    //   if (this.streaming) {
    //     this.height =this.video.videoHeight / (this.video.videoWidth/this.width);
  
    //     this.video.setAttribute('width',this. width);
    //     this.video.setAttribute('height',this. height);
    //     this. canvas.setAttribute('width',this. width);
    //     this.canvas.setAttribute('height',this. height);
    //     this.streaming = true;
    //   }
    // }, true);
  }
}
