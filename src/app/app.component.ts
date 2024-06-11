import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticlesListService } from './articles-list.service';
import {
  HttpClientModule,
  HttpClient,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ArticlesListService],
})
export class AppComponent {
  title = 'FloTed';
  data: any;
  articles: any;

  constructor(private articlesListService: ArticlesListService) {}

  ngOnInit() {
    this.articlesListService.getData().subscribe(
      (response) => {
        this.articles = response;
        console.log(this.articles);
      },
      (error) => {
        console.log("Erreur de l'appel API :", error);
      }
    );
  }
}
