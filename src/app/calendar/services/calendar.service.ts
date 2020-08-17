import { Injectable } from '@angular/core';
import { config } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Event } from '../models/event';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  selectedDay: string;

  constructor(private http: HttpClient) { }

  setSelectedDay(selectedDay) {
    this.selectedDay = selectedDay;
  }

  getSelectedDay() {
    return this.selectedDay;
  }

  createEvent(event: Event) {
    return this.http.post<Event>(`${config.apiUrl}/events`, event)
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  createTask(task: Task) {
    return this.http.post<Task>(`${config.apiUrl}/tasks`, task)
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${config.apiUrl}/events`);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${config.apiUrl}/tasks`);
  }

}
