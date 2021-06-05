import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class ApiserviceService{

  constructor(private http: HttpClient) { }

  getIssues() {
    let obj = {
      userName:'Sivaratheesh H',
      password:"P@s5w0rd",
      mailID:'ratheesh93@gmail.com',
      mobilenumber:"8489782378"
    }
    return this.http.post('/api/user/register',obj,this.jwt());
  }
  getuseer() {
    let obj = {
      userName:'Sivaratheesh H',
      password:"P@s5w0rd",
      mailID:'ratheesh93@gmail.com',
      mobilenumber:"8489782378"
    }
    return this.http.get('/api/user/',this.jwt())
  }
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const clonedRequest = req.clone({
  //     responseType: 'text'
  //   });

  //   return next.handle(clonedRequest).pipe(  map((event: Response) => {
  //     if (event instanceof HttpResponse) {
  //       return event.clone({
  //         body: JSON.parse(event.body),
  //       });
  //     }
  //   }))
    
  //     .catch((error: HttpErrorResponse) => {
  //         const parsedError:any = Object.assign({}, error, { error: JSON.parse(error.error) });
  //         return Observable.throw(new HttpErrorResponse(parsedError));
  //     });
  //   }

  public jwt(){
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
    return { headers: headers };
  }
}
