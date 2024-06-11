import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ArticlesListService } from './articles-list.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService],
})
export class AppComponent implements OnInit {
  title = 'FloTed';
  isLoggedIn = false;

  constructor(
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.currentUser.subscribe(() => {
      this.isLoggedIn = this.authService.isLoggedIn();
      this.cdr.detectChanges();
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.cdr.detectChanges();
  }
}
