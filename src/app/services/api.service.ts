import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mapTo, catchError, map } from 'rxjs/operators';
import { config } from '../config/config';
import { of, Observable } from 'rxjs';
import { Task, Event, AllEvents } from '../models/event';
import { User } from '../models/user';
import { List } from '../models/list';

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

  createTaskByUserId(id: string, task: Task) {
    return this.http.post<Task>(`${config.apiUrl}/tasks/` + id, task)
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  createList(list: List) {
    return this.http.post<Event>(`${config.apiUrl}/lists`, list)
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${config.apiUrl}/user`);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${config.apiUrl}/events`);
  }

  getEventById(id: string) {
    return this.http.get<Event>(`${config.apiUrl}/events/` + id);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${config.apiUrl}/tasks`);
  }

  getTaskById(id: string) {
    return this.http.get<Task>(`${config.apiUrl}/tasks/` + id);
  }

  getUserByUsername(username: string) {
    return this.http.get<User>(`${config.apiUrl}/user/` + username);
  }

  getShareEventsByUserId(id: string) {
    return this.http.get<Event[]>(`${config.apiUrl}/share-events/` + id);
  }

  getShareTasksByUserId(id: string) {
    return this.http.get<Task[]>(`${config.apiUrl}/share-tasks/` + id);
  }

  getLists(): Observable<List[]> {
    return this.http.get<List[]>(`${config.apiUrl}/lists`)
      .pipe(
        map(lists => lists.sort((a: List, b: List) =>
          (new Date(b.createdOn)).getTime() - (new Date(a.createdOn)).getTime()
          ))
        );
  }

  updateTaskById(id, task: Task) {
    return this.http.put<Task[]>(`${config.apiUrl}/tasks/` + id, task);
  }

  updateEventById(id, event: Event) {
    return this.http.put<Event[]>(`${config.apiUrl}/events/` + id, event);
  }

  updateUserById(id, user: User) {
    return this.http.put<User>(`${config.apiUrl}/users/` + id, user);
  }

  updateListById(id, list: List) {
    return this.http.put<List>(`${config.apiUrl}/lists/` + id, list);
  }

  updateUserIsSharedById(id, user: User) {
    return this.http.put<User>(`${config.apiUrl}/user/` + id, user);
  }

  deleteEventById(id) {
    return this.http.delete<Event[]>(`${config.apiUrl}/events/` + id);
  }

  deleteTaskById(id) {
    return this.http.delete<Task[]>(`${config.apiUrl}/tasks/` + id);
  }

  deleteListById(id) {
    return this.http.delete<List[]>(`${config.apiUrl}/lists/` + id);
  }

  getAllEvents(): Observable<AllEvents[]> {
    return this.http.get<AllEvents[]>(`${config.apiUrl}/events`);
  }

  updatePassword(data) {
    return this.http.put<any>(`${config.apiUrl}/password`, data);
  }
}
