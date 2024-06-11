import { Component } from '@angular/core';
import { ArticlesListService } from '../articles-list.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [ArticlesListService],
})
export class HomeComponent {
  data: any;
  articles: any;
  title = 'FloTed';
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
