import { Injectable } from '@angular/core';
import { CalendarService } from './calendar.service';
import { DayConfig } from '../ion2-calendar';
import { Task } from '../models/task';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})

export class InitCalendarService {
  userEvents: Event[];
  userTasks: Task[];
  daysConfig: DayConfig[] = [];

  constructor(private calService: CalendarService) { }

  initialize(){
    this.loadEvents();
    this.loadTasks();
  }

  loadEvents() {
    this.calService.getEvents().subscribe(data => {
      this.userEvents = data;
      this.addDaysConfig(data);
      console.log('userEvents1', this.userEvents);
    });
  }

  loadTasks() {
    this.calService.getTasks().subscribe(data => {
      this.userTasks = data;
      this.addDaysConfig(data);
      console.log('userTasks1', this.userTasks);
    });
  }

  addDaysConfig(data) {
    data.forEach(element => {
      console.log('startTime', element.startTime);
      this.daysConfig.push({
        date: new Date(element.startTime),
        subTitle: '●',
        marked: true,
        disable: false
      });
    });
    console.log('daysConfig', this.daysConfig);
  }
}
