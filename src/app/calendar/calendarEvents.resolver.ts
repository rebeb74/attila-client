import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { Event } from '../models/event';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Injectable()
export class CalendarEventsResolver implements Resolve<Event[]> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<Event[]> {
    return this.apiService.getEvents().pipe<Event[]>(
        catchError((error) => {
          console.log('error', error);
          return empty();
        })
      );
  }
}
