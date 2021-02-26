import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mapTo, catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Task, Event, AllEvents } from '../models/event';
import { User } from '../models/user';
import { List } from '../models/list';
import * as env from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  createEvent(event: Event) {
    return this.http.post<Event>(`${env.environment.apiUrl}/events`, event)
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  createTask(task: Task) {
    return this.http.post<Task>(`${env.environment.apiUrl}/tasks`, task)
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  createTaskByUserId(id: string, task: Task) {
    return this.http.post<Task>(`${env.environment.apiUrl}/tasks/` + id, task)
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  createList(list: List) {
    return this.http.post<Event>(`${env.environment.apiUrl}/lists`, list)
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${env.environment.apiUrl}/user`);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${env.environment.apiUrl}/events`);
  }

  getEventById(id: string) {
    return this.http.get<Event>(`${env.environment.apiUrl}/events/` + id);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${env.environment.apiUrl}/tasks`);
  }

  getTaskById(id: string) {
    return this.http.get<Task>(`${env.environment.apiUrl}/tasks/` + id);
  }

  getUserByUsername(username: string) {
    return this.http.get<User>(`${env.environment.apiUrl}/user/` + username);
  }

  getShareEventsByUserId(id: string) {
    return this.http.get<Event[]>(`${env.environment.apiUrl}/share-events/` + id);
  }

  getShareTasksByUserId(id: string) {
    return this.http.get<Task[]>(`${env.environment.apiUrl}/share-tasks/` + id);
  }

  getLists(): Observable<List[]> {
    return this.http.get<List[]>(`${env.environment.apiUrl}/lists`)
      .pipe(
        map(lists => lists.sort((a: List, b: List) =>
          (new Date(b.createdOn)).getTime() - (new Date(a.createdOn)).getTime()
        ))
      );
  }

  getShareListsByUserId(id: string) {
    return this.http.get<List[]>(`${env.environment.apiUrl}/share-lists/` + id);
  }

  updateTaskById(id, task: Task) {
    return this.http.put<Task[]>(`${env.environment.apiUrl}/tasks/` + id, task);
  }

  updateEventById(id, event: Event) {
    return this.http.put<Event[]>(`${env.environment.apiUrl}/events/` + id, event);
  }

  updateUserById(id, user: User) {
    return this.http.put<User>(`${env.environment.apiUrl}/users/` + id, user);
  }

  updateListById(id, list: List) {
    return this.http.put<List>(`${env.environment.apiUrl}/lists/` + id, list);
  }

  updateUserIsSharedById(id, user: User) {
    return this.http.put<User>(`${env.environment.apiUrl}/user/` + id, user);
  }

  deleteEventById(id) {
    return this.http.delete<Event[]>(`${env.environment.apiUrl}/events/` + id);
  }

  deleteTaskById(id) {
    return this.http.delete<Task[]>(`${env.environment.apiUrl}/tasks/` + id);
  }

  deleteListById(id) {
    return this.http.delete<List[]>(`${env.environment.apiUrl}/lists/` + id);
  }

  getAllEvents(): Observable<AllEvents[]> {
    return this.http.get<AllEvents[]>(`${env.environment.apiUrl}/events`);
  }

  updatePassword(data) {
    return this.http.put<any>(`${env.environment.apiUrl}/password`, data);
  }
}
