import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mapTo, catchError } from 'rxjs/operators';
import { config } from '../config/config';
import { of, Observable } from 'rxjs';
import { Task, Event, AllEvents } from '../models/event';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

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

  getUser(): Observable<User>{
    return this.http.get<User>(`${config.apiUrl}/user`);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${config.apiUrl}/events`);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${config.apiUrl}/tasks`);
  }

  getUserByUsername(username: string){
    return this.http.get<User>(`${config.apiUrl}/user/` + username);
  }

  updateTaskById(id, task: Task){
    return this.http.put<Task[]>(`${config.apiUrl}/tasks/` + id, task);
  }

  updateUserById(id, user: User){
    return this.http.put<User>(`${config.apiUrl}/users/` + id, user);
  }

  updateUserIsSharedById(id, user: User){
    return this.http.put<User>(`${config.apiUrl}/user/` + id, user);
  }

  deleteEventById(id){
    return this.http.delete<Event[]>(`${config.apiUrl}/events/` + id);
  }

  deleteTaskById(id){
    return this.http.delete<Task[]>(`${config.apiUrl}/tasks/` + id);
  }

  getAllEvents(): Observable<AllEvents[]> {
    return this.http.get<AllEvents[]>(`${config.apiUrl}/events`);
  }

  updatePassword(data){
    return this.http.put<any>(`${config.apiUrl}/password`, data);
  }
}
