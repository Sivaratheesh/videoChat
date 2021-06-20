import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from 'src/app/apiservice.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm : any = FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,private apiservice :ApiserviceService) { }

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
    const md5 = new Md5();
    if(this.loginForm.valid){
      let obj = {
        email : this.loginForm.value.email,
        password :md5.appendStr(this.loginForm.value.password).end()
      }
    console.log(this.loginForm.valid, this.loginForm.value);
    this.apiservice.getuser(obj).subscribe((data: any) => {
      console.log(data);
    });
  }
  }
}
