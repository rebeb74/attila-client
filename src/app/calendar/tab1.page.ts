import { Component, OnInit, Injectable } from '@angular/core';
import { CalendarComponentOptions, CalendarComponent, DayConfig } from './ion2-calendar';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarService } from './services/calendar.service';
import { Task } from './models/task';
import { Event } from './models/event';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  dateRange: { from: string; to: string; };
  date: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  selectedDay: string;
  typeEvent = 'task';
  userEvents: Event[];
  userTasks: Task[];
  daysConfig: DayConfig[] = [];

  optionsRange: CalendarComponentOptions = {
    daysConfig: this.daysConfig,
    monthFormat: 'MMMM YYYY',
    monthPickerFormat: ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    pickMode: 'single',
    color: 'primary',
    weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    weekStart: 0,
    from: new Date(),
    showAdjacentMonthDay: false,
    showToggleButtons: true
  };
  constructor(public calendarComponent: CalendarComponent, private calService: CalendarService, private route: ActivatedRoute) {
    moment.locale('fr-ch');
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadTasks();
    this.refresh();
  }

  refresh() {
    setTimeout(() => {
      const newOptions = {
        daysConfig: this.daysConfig
      };
      this.optionsRange = {
        ...this.optionsRange,
        ...newOptions
      };
    }, 1000);
  }

  doRefresh(event) {
    setTimeout(() => {
      const newOptions = {
        daysConfig: this.daysConfig
      };
      this.optionsRange = {
        ...this.optionsRange,
        ...newOptions
      };
      console.log('optionsRange refresh', this.optionsRange);
      event.target.complete();
    }, 1000);
  }

  onChange($event) {
    this.selectedDay = moment($event.time).toString();
    this.calService.setSelectedDay(this.selectedDay);
  }

  loadEvents() {
    // this.route.data.subscribe((data: Event[]) => {
    this.calService.getEvents().subscribe(data => {
      this.userEvents = data;
      this.addDaysConfig(data);
    });
  }

  loadTasks() {
    this.calService.getTasks().subscribe(data => {
      this.userTasks = data;
      this.addDaysConfig(data);
    });
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


}
