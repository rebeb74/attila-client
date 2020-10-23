import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { List } from '../models/list';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Injectable()
export class ListResolver implements Resolve<List[]> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<List[]> {
    return this.apiService.getLists().pipe<List[]>(
        catchError((error) => {
          console.log('error', error);
          return empty();
        })
      );
  }
}

