import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  public video:any;

  constructor() { }

  public getvideo(){
    navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: 'environment'
      },audio:true
    })
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
      this.video.play();
     this.video.getVideoTracks();
      // let url = window.URL.createObjectURL(stream);
      // console.log(url)
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });
  }
}
