import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Tokens } from '../models/tokens';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import * as env from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  constructor(private http: HttpClient, private router: Router) { }

  register(user: { email: string, username: string, password: string }): Observable<boolean | number> {
    return this.http.post<any>(`${env.environment.apiUrl}/register`, user)
      .pipe(
        mapTo(201),
        catchError((error: HttpErrorResponse) => {
          console.log('error', error.error);
          return of(error.status);
        }));
  }


  login(user: { username: string, password: string }): Observable<boolean> {
    console.log('user', user);
    return this.http.post<any>(`${env.environment.apiUrl}/login`, user)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  logout() {
    return this.http.post<any>(`${env.environment.apiUrl}/logout`, {
      'token': this.getRefreshToken()
    })
      .pipe(
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
    return this.http.post<any>(`${env.environment.apiUrl}/token`, {
      'token': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeAccessToken(tokens.accessToken);
      this.storeRefreshToken(tokens.refreshToken);
    }));
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
    window.location.href = '/auth';
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
  }

  private removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
