import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
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

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((user) => {
          const localStorage = this.document.defaultView?.localStorage;
          if (localStorage) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        })
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      password,
    });
  }

  logout(): void {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }
}
