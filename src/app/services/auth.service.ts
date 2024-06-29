import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000';
  private _username: string = '';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  register(user: { username: string; password: string; }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: { username: string; password: string; }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access_token);
        this._username = credentials.username;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._username = '';
  }

  identityCheck() {
    const token: string | null = localStorage.getItem('token');
    let expired: boolean;

    try {
      expired = this.jwtHelper.isTokenExpired(token);
    } catch {
      expired = true;
    }

    _isAuthenticated = token != null && !expired;
  }

  get isAuthenticated(): boolean {
    this.identityCheck();
    return _isAuthenticated;
  }

  getUsername(): string {
    return this._username;
  }
}

export let _isAuthenticated: boolean;
