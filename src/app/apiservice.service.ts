import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private http: HttpClient) { }

  insertUser(data: any) {
    return this.http.post('https://chatapi-6apy.onrender.com/user/register', data, this.jwt());
    }
  getuser(data: any) {

    return this.http.post('https://chatapi-6apy.onrender.com/user/', data, this.jwt())
  }

  getAllOnlineuser(id: any) {

    return this.http.get('https://chatapi-6apy.onrender.com/user/onlineUsers/'+ id, this.jwt())
  }

  logOutUser(data: any) {

    return this.http.post('https://chatapi-6apy.onrender.com/user/logOut', data, this.jwt())
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

  public jwt() {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
    return { headers: headers };
  }

  setLocalStorage(key: any, value: any) {
    localStorage.setItem(key, btoa(JSON.stringify(value)));
  }
  getLocalStorage(key: any): any {
    if (localStorage.getItem(key)) {
      return JSON.parse(atob(localStorage.getItem(key) || '{}'));
    } else 
    { return null; }
  }
}
