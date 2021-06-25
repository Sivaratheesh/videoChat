import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { SocketService } from 'src/app/socket.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm : any = FormGroup;
  submitted = false;
  invalidUser: boolean = false;
  incorrectPassword: boolean = false;

  constructor(private formBuilder: FormBuilder,private apiservice :ApiserviceService,
    private router:Router, private socketservice:SocketService) { }

  ngOnInit(): void {
    const emailPattern = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}';
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', [Validators.required]]
  });
  }
  get f() { return this.loginForm.controls; }

  public login(){
    this.submitted = true;
    this.incorrectPassword = false;
    this.invalidUser = false;
    const md5 = new Md5();
    if(this.loginForm.valid){
      let obj = {
        email : this.loginForm.value.email,
        password :md5.appendStr(this.loginForm.value.password).end()
      }
    // console.log(this.loginForm.valid, this.loginForm.value);
    this.apiservice.getuser(obj).subscribe((data: any) => {
      if(data.result == 'success'){
      this.socketservice.iAmInOnline(data.user);
      if(this.apiservice.getLocalStorage('user')){
        let user = this.apiservice.getLocalStorage('user');
        if(user.id != data.user.id){
          localStorage.clear();
      this.apiservice.setLocalStorage('user',data.user);
        }
      }else{
        this.apiservice.setLocalStorage('user',data.user);
      }
        this.router.navigate(['app/']);
      }else if(data.result == 'invalid'){
        this.invalidUser = true;

      }else if(data.result == 'incorrect'){
           this.incorrectPassword = true;
      }
      console.log(data);
    });
  }
  }
}
