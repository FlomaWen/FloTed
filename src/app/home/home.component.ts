import { Component } from '@angular/core';
import { ArticlesListService } from '../articles-list.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../auth/interceptor.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [
    ArticlesListService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class HomeComponent {
  articles: any;
  constructor(private articlesListService: ArticlesListService) {}

  ngOnInit() {
    this.articlesListService.getData().subscribe(
      (response) => {
        this.articles = response.slice(-5).reverse();
      },
      (error) => {
        console.log("Erreur de l'appel API :", error);
      }
    );
  }
}
