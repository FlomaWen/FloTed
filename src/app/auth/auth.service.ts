import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {
    const localStorage = document.defaultView?.localStorage;
    const currentUser = localStorage?.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(
      currentUser ? JSON.parse(currentUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          const localStorage = this.document.defaultView?.localStorage;
          if (response.access_token && response.refresh_token && localStorage) {
            localStorage.setItem('accessToken', response.access_token);
            localStorage.setItem('refreshToken', response.refresh_token);
            localStorage.setItem(
              'accessTokenExpiry',
              (Date.now() + 30 * 60 * 1000).toString()
            );
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user); // Notify the change
          } else {
            console.error('Tokens or user information missing in response');
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(error);
        })
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, { username, password })
      .pipe(
        catchError((error) => {
          console.error('Registration error:', error);
          return throwError(error);
        })
      );
  }

  logout(): void {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessTokenExpiry');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null); // Notify the change
  }

  refreshToken(): Observable<any> {
    const localStorage = this.document.defaultView?.localStorage;
    const refreshToken = localStorage?.getItem('refreshToken');
    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    return this.http
      .post<any>(`${this.apiUrl}/refresh-token`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((response) => {
          if (response.access_token && localStorage) {
            localStorage.setItem('accessToken', response.access_token);
            localStorage.setItem(
              'accessTokenExpiry',
              (Date.now() + 30 * 60 * 1000).toString()
            );
          } else {
            console.error(
              'New access token missing in the refresh token response'
            );
          }
        }),
        catchError((error) => {
          console.error('Refresh token error:', error);
          this.logout(); // Optional: Logout user if refresh fails
          return throwError(error);
        })
      );
  }

  getAccessToken(): string | null {
    const localStorage = this.document.defaultView?.localStorage;
    const accessToken = localStorage?.getItem('accessToken');
    const accessTokenExpiry = localStorage?.getItem('accessTokenExpiry');

    if (accessToken && accessTokenExpiry && Date.now() > +accessTokenExpiry) {
      this.refreshToken().subscribe(
        () => console.log('Token refreshed successfully'),
        (error) => console.error('Token refresh failed:', error)
      );
      return null;
    }

    return accessToken || null;
  }
}
