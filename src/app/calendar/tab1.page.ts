import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { CalendarComponentOptions, CalendarComponent, DayConfig } from './ion2-calendar';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarService } from '../services/calendar.service';
import { Event, Task } from '../models/event';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('calendar', { read: CalendarComponent }) calendarRef: CalendarComponent;

  dateRange: { from: string; to: string; };
  date: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  selectedDay: Date;
  userEvents: Event[];
  userTasks: Task[];
  daysConfig: DayConfig[] = [];
  daysConfigSubcription: Subscription;
  optionsRangeSubcription: Subscription;
  optionsRange: CalendarComponentOptions;
  dayEvents = [];
  dayTasks = [];

  constructor(
    private calService: CalendarService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    moment.locale('fr-ch');
    router.events.subscribe(val => {
      if (val) {
        this.refresh();
        this.showEventsList();
      }
    });
  }

  ngOnInit(): void {
    this.initOptionsRange();
    this.loadEvents();
    this.loadTasks();
  }

  initOptionsRange() {
    this.daysConfigSubcription = this.calService.daysConfigSubject.subscribe(
      (dayConfig: DayConfig[]) => this.daysConfig = dayConfig);
    this.calService.emitDaysConfigSubject();
    this.optionsRangeSubcription = this.calService.optionsRangeSubject.subscribe(
      (optionRange: CalendarComponentOptions) => {
        this.optionsRange = optionRange;
        this.optionsRange.daysConfig = this.daysConfig;
      }
    );
    this.calService.emitOptionsRangeSubject();
  }

  loadEvents() {
    this.route.data.subscribe((data: { event: Event[] }) => {
      this.userEvents = data.event;
      this.addDaysConfig(data.event);
    });
  }

  loadTasks() {
    this.route.data.subscribe((data: { task: Task[] }) => {
      this.userTasks = data.task;
      this.addDaysConfig(data.task);
    });
  }

  refresh() {
    const newOptions = {
      daysConfig: this.daysConfig
    };
    this.optionsRange = {
      ...this.optionsRange,
      ...newOptions
    };
  }

  doRefresh(event) {
    this.refresh();
    event.target.complete();
  }

  onChange($event) {
    this.selectedDay = new Date(moment($event.time).toString());
    this.calService.setSelectedDay(this.selectedDay);
    this.showEventsList();
  }

  addDaysConfig(data) {
    data.forEach(element => {
      this.daysConfig.push({
        date: new Date(element.startTime),
        subTitle: '●',
        marked: true,
        disable: false
      });
    });
  }

  updateDaysConfig() {
    this.daysConfig = [];
    this.addDaysConfig(this.userTasks);
    this.addDaysConfig(this.userEvents);
  }

  showEventsList() {
    this.dayEvents = [];
    this.dayTasks = [];
    this.userEvents.forEach(e => {
      if (new Date(e.startTime).toString().substring(4, 15) === new Date(this.selectedDay).toString().substring(4, 15)) {
        this.dayEvents.push(e);
      }
    });
    this.userTasks.forEach(e => {
      if (new Date(e.startTime).toString().substring(4, 15) === new Date(this.selectedDay).toString().substring(4, 15)) {
        this.dayTasks.push(e);
      }
    });
  }

  deleteEvent(id) {
    this.userEvents.forEach((e, index) => {
      if (e._id === id) {
        // Delete database
        this.apiService.deleteEventById(id).subscribe();
        // update userEvents
        this.userEvents.splice(index, 1);
        // update daysConfig
        this.updateDaysConfig();
      }
    });
    this.showEventsList();
    this.refresh();
  }

  deleteTask(id) {
    this.userTasks.forEach((e, index) => {
      if (e._id === id) {
        // Delete database
        this.apiService.deleteTaskById(id).subscribe();
        // update userEvents
        this.userTasks.splice(index, 1);
        // update daysConfig
        this.updateDaysConfig();
      }
    });
    this.showEventsList();
    this.refresh();
  }

  repeatTask(id) {
    this.userTasks.forEach(e => {
      if (e._id === id) {
        const newDate = new Date(moment(new Date(e.startTime)).add(e.repeat, 'week').toString());

        // TODO altern user
        // if (e.altern) {
        //   if (e.user === 'Clémentine') {
        //     e.user = 'Bertrand';
        //   } else {
        //     e.user = 'Clémentine';
        //   }
        // }

        // Update database
        this.apiService.updateTaskById(
          id,
          {
            startTime: newDate,
            userId: e.userId
          }
        );

        // update allEvents
        e.startTime = newDate;

        // update _daysConfig
        this.updateDaysConfig();
      }
    });
    this.showEventsList();
    this.refresh();
  }

  onEventClick(eventId) {
    
  }

}
