import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check authentication status on service initialization
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      // If we're on the login page and have a token, redirect to dashboard
      if (this.router.url === '/login') {
        this.router.navigate(['/dashboard']);
      }
    } else {
      // If no token and not on login/signup page, redirect to login
      if (!['/login', '/signup'].includes(this.router.url)) {
        this.router.navigate(['/login']);
      }
    }
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/signup`, userData);
  }

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.access_token) {
            localStorage.setItem('token', response.access_token);
            this.isAuthenticatedSubject.next(true);
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

}
