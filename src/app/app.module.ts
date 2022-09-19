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
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpeechtotextComponent } from './speechtotext/speechtotext.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const config: SocketIoConfig = { url:environment.socketUrl,options:{}};

// const routes: Routes = [
//   {path:'',component:HomeComponent}];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    SpeechtotextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [VideoService,ApiserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
