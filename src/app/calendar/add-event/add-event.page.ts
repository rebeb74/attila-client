import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarService } from '../../services/calendar.service';
import { Subscription } from 'rxjs';
import { DayConfig, CalendarComponentOptions } from '../ion2-calendar';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  typeEvent = 'task';
  addEventForm: FormGroup;
  daysConfigSubcription: Subscription;
  optionsRangeSubcription: Subscription;
  optionsRange: CalendarComponentOptions;
  daysConfig: DayConfig[] = [];
  startTime = moment(this.calService.getSelectedDay()).format('YYYY-MM-DD') || moment(new Date('YYYY-MM-DD')).format('YYYY-MM-DD');
  currentCalUsername: string;
  shareList: [] = [];
  shareListTemp: [];

  constructor(private fb: FormBuilder, private router: Router, private calService: CalendarService, private apiService: ApiService) { }

  ngOnInit() {
    this.createForm();
    this.inputProps();
    this.onRepeatChange();
  }

  createForm() {
    this.addEventForm = this.fb.group({
      eventId: '',
      title: '',
      description: '',
      startTime: this.startTime,
      startHour: '08:00',
      place: '',
      repeat: '0',
      altern: '',
      alert: moment(this.calService.getSelectedDay()).format('YYYY-MM-DD 08:00')
    });
  }

  inputProps() {
    this.currentCalUsername = this.calService.getCurrentCalUsername();
    this.calService.getShareList().forEach((element, index) => {
      if (index !== 0) {
        console.log('element', element);
        this.shareList.push(element);
      }
    });
  }

  get f() { return this.addEventForm.controls; }

  typeEventChange($event) {
    this.typeEvent = $event.detail.value;
  }

  createEvent(formDirective: FormGroupDirective) {
    console.log(this.addEventForm);
    if (this.addEventForm.valid) {
      console.log(this.addEventForm);
      if (this.typeEvent === 'rdv') {
        console.log('typeEventEvent', this.typeEvent);
        this.apiService
          .createEvent(this.addEventForm.value)
          .subscribe(data => this.handleSuccess(data, formDirective), error => this.handleError(error));
      } else {
        console.log('typeEventTask', this.typeEvent);
        this.apiService
          .createTask(this.addEventForm.value)
          .subscribe(data => this.handleSuccess(data, formDirective), error => this.handleError(error));
      }
    }
  }

  onRepeatChange() {
    this.addEventForm.get('altern').disable();
    this.addEventForm.get('repeat').valueChanges
      .subscribe(repeatValue => {
        console.log('repeatValue', repeatValue);
        if (repeatValue === '0') {
          this.addEventForm.get('altern').reset();
          this.addEventForm.get('altern').disable();
        } else {
          this.addEventForm.get('altern').enable();
        }
      });
  }

  handleSuccess(data, formDirective) {
    console.log('OK event created', data);
    this.addEventForm.reset(); // reset inputs
    formDirective.resetForm(); // reset validation
    this.router.navigate(['/tabs/tab1']);
  }

  handleError(data) {
    console.log('KO event not created', data);
  }
}
