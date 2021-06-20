import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from 'src/app/apiservice.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: any = FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,private apiservice :ApiserviceService) { }

  ngOnInit() {
    const emailPattern = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,3}';
    const password = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(password), Validators.maxLength(100), Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],

    },
      {
        validators: [this.passwordmismatch('password', 'confirmPassword')
        ]
      });
  }
  public passwordmismatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordmismatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }

  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  register() {
    this.submitted = true;
    const md5 = new Md5();
    if(this.registerForm.valid){
      let obj = {
        name : this.registerForm.value.name,
        email : this.registerForm.value.email,
        password :md5.appendStr(this.registerForm.value.password).end()
      }
      this.apiservice.insertUser(obj).subscribe(data =>{
        console.log(data);
        // console.log(this.socketservice);  
      })
    }
  
    // console.log(this.registerForm.valid, this.registerForm.value)
  }
}
