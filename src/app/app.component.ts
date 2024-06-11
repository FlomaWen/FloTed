import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ArticlesListService } from './articles-list.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ArticlesListService],
})
export class AppComponent {
  title = 'FloTed';

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
