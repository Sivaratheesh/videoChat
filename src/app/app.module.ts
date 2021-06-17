import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ApiserviceService } from './apiservice.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { VideoService } from './video.service';
import { SocketService } from './socket.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './error-interceptor.service';
import { environment } from 'src/environments/environment';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SharedModule } from './shared/shared.module';

// const config: SocketIoConfig = { url:environment.socketUrl, options: { origin:'*', transport : ['websocket']} };

// const routes: Routes = [
//   {path:'',component:HomeComponent}];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    // SocketIoModule.forRoot(config),
  ],
  providers: [VideoService,ApiserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
