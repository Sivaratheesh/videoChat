import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private http: HttpClient) { }

  getIssues() {
    let obj = {
      userName:'Sivaratheesh H',
      password:"P@s5w0rd",
      mailID:'ratheesh93@gmail.com',
      mobilenumber:"8489782378"
    }
    return this.http.post('https://chatappapi3005.herokuapp.com/api/user/register',obj);
  }

}
