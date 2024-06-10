import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // Assurez-vous que BrowserModule est importé
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [BrowserModule, HttpClientModule],
  bootstrap: [],
  providers: [provideHttpClient(withFetch())],
})
export class AppModule {}
