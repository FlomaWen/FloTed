import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: AppComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '**', redirectTo: '' },
    ]),
  ],
  bootstrap: [],
  providers: [provideHttpClient(withFetch())],
})
export class AppModule {}
