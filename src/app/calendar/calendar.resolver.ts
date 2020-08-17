import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CalendarService } from './services/calendar.service';
import { Observable, empty } from 'rxjs';
import { Event } from './models/event';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CalendarResolver implements Resolve<Event[]> {
  constructor(private calService: CalendarService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Event[]> {
    return this.calService.getEvents().pipe<Event[]>(
        catchError((error) => {
        return empty();
        })
      );
  }
}
