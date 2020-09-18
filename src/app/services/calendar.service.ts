import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { DayConfig, CalendarComponentOptions } from '../calendar/ion2-calendar';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  selectedDay: Date;
  private daysConfig: DayConfig[] = [];
  daysConfigSubject = new Subject<DayConfig[]>();
  daysConfigSubcription: Subscription;
  currentCalUsername: string;
  shareList: [];

  private optionsRange: CalendarComponentOptions = {
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
  optionsRangeSubject = new Subject<CalendarComponentOptions>();

  constructor(private http: HttpClient) { }

  emitDaysConfigSubject(){
    this.daysConfigSubject.next(this.daysConfig.slice());
  }

  emitOptionsRangeSubject(){
    this.daysConfigSubcription = this.daysConfigSubject.subscribe(
      (dayConfig: DayConfig[]) => this.daysConfig = dayConfig);
    this.emitDaysConfigSubject();
    this.optionsRangeSubject.next(this.optionsRange);
  }

  setSelectedDay(selectedDay) {
    this.selectedDay = new Date(moment(selectedDay).format());
  }

  getSelectedDay() {
    return this.selectedDay;
  }

  setCurrentCalUsername(username) {
    this.currentCalUsername = username;
  }

  getCurrentCalUsername() {
    return this.currentCalUsername;
  }

  setShareList(shareList) {
    this.shareList = shareList;
  }

  getShareList() {
    console.log('this.shareList', this.shareList);
    return this.shareList;
  }

}
