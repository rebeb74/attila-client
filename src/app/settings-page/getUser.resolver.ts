import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';

@Injectable()
export class GetUserResolver implements Resolve<User> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<User> {
    return this.apiService.getUser().pipe<User>(
        catchError((error) => {
          console.log('error', error);
          return empty();
        })
      );
  }
}
