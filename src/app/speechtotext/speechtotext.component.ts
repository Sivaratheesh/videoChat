import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VideoService } from '../video.service';
const mediaDevices = navigator.mediaDevices as any;
let completeBlob: Blob;
declare var MediaRecorder: any;
declare const annyang: any;
@Component({
  selector: 'app-speechtotext',
  templateUrl: './speechtotext.component.html',
  styleUrls: ['./speechtotext.component.scss']
})
export class SpeechtotextComponent implements OnInit {
  hasVideo: boolean = false;
  isRecording: boolean = false;
  recorder: any;
  stream: any;
  @ViewChild('recordVideo')recordVideo!: ElementRef;
  public speech = new SpeechSynthesisUtterance();
public voices:any = [];
  constructor(public service: VideoService) {
    this.service.init()
    this.speech.lang = "en";
    this.speech.rate = 0.8;
    this.speech.volume = 1;
    this.speech.pitch = 1;
  }

  ngOnInit(): void {
    window.speechSynthesis.onvoiceschanged = () => {
      // Get List of Voices
      this.voices = window.speechSynthesis.getVoices();
    
      // Initially set the First Voice in the Array.
      this.speech.voice = this.voices[7];
    
      // Set the Voice Select List. (Set the Index as the value, which we'll use later when the user updates the Voice using the Select Menu.)
      let voiceSelect:any = document.querySelector("#voices");
      this.voices.forEach((voice:any, i:any) => (voiceSelect.options[i] = new Option(voice.name, i)));
    };
    let voiceChange:any = document.querySelector("#voices");
    voiceChange.addEventListener("change", () => {
  // On Voice change, use the value of the select menu (which is the index of the voice in the global voice array)
  this.speech.voice = this.voices[voiceChange.value];
  console.log(  this.speech.voice )
});
  }
  startService() {
    this.service.start()
  }

  stopService() {
    this.service.stop()
  }
  public voice(){
  this.speech.text = this.service.text;
  window.speechSynthesis.speak(this.speech);
  }
  public resume(){
    window.speechSynthesis.resume();
  }
  public close(){
    window.speechSynthesis.cancel();
  }
  public pause(){
    window.speechSynthesis.pause();
  }
  async startRecording() {
    this.stream = await mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" }
    });
    this.recorder = new MediaRecorder(this.stream);


    const chunks: any[] | undefined = [];
    this.recorder.ondataavailable = (e: { data: any; }) => chunks.push(e.data);
    this.recorder.onstop = (e: any) => {
      completeBlob = new Blob(chunks, { type: chunks[0].type });
      this.recordVideo.nativeElement.src = URL.createObjectURL(completeBlob);
    };


    this.recorder.start();
  }


  recordStart() {
    this.hasVideo = false;
    this.isRecording = true;
    this.startRecording();
  }


  recordStop() {
    this.hasVideo = true;
    this.isRecording = false;
    this.recorder.stop();
    this.stream.getVideoTracks()[0].stop();
  }


  downloadBlob(name = 'video.mp4'): any {
    // if (
    //   window.navigator &&
    //   window.navigator.msSaveOrOpenBlob
    // ) return window.navigator.msSaveOrOpenBlob(completeBlob);


    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(completeBlob);


    const link = document.createElement('a');
    link.href = data;
    link.download = name;


    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );


    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }
}
