import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tokens } from '../models/tokens';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly LOGGED_USER = 'LOGGED_USER';
  private loggedUser: string;

  constructor(private http: HttpClient) { }

  register(user: { email: string, username: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${config.apiUrl}/register`, user)
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }


  login(user: { username: string, password: string }): Observable<boolean> {
    console.log('user', user);
    return this.http.post<any>(`${config.apiUrl}/login`, user)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  logout() {
    return this.http.post<any>(`${config.apiUrl}/logout`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        console.log('error', error.error);
        return of(false);
      }));
  }

  isLoggedIn() {
    return !!this.getAccessToken();
  }

  refreshToken() {
    return this.http.post<any>(`${config.apiUrl}/token`, {
      'token': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeAccessToken(tokens.accessToken);
      this.storeRefreshToken(tokens.refreshToken);
    }));
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeAccessToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  private storeRefreshToken(refreshToken: string) {
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(this.LOGGED_USER, this.loggedUser);
  }

  private removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.LOGGED_USER);
  }
}
