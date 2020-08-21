import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarService } from '../../services/calendar.service';
import { Subscription } from 'rxjs';
import { DayConfig, CalendarComponentOptions } from '../ion2-calendar';
import { ApiService } from 'src/app/services/api.service';

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

  constructor(private fb: FormBuilder, private router: Router, private calService: CalendarService,  private apiService: ApiService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.addEventForm = this.fb.group({
      eventId: '',
      user: '',
      title: '',
      description: '',
      startTime: this.calService.getSelectedDay(),
      startHour: '08:00',
      place: '',
      repeat: '0',
      altern: false,
      alert: this.calService.getSelectedDay()
    });
  }

  get f() { return this.addEventForm.controls; }

  typeEventChange($event) {
    this.typeEvent = $event.detail.value;
  }

  createEvent(formDirective: FormGroupDirective) {
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
