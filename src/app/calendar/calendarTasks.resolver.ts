import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { Task } from '../models/event';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Injectable()
export class CalendarTasksResolver implements Resolve<Task[]> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<Task[]> {
    return this.apiService.getTasks().pipe<Task[]>(
        catchError((error) => {
          console.log('error', error);
          return empty();
        })
      );
  }
}
