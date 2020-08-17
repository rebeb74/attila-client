import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarService } from '../services/calendar.service';
import { Tab1Page } from '../tab1.page';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  typeEvent = 'task';
  addEventForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private calService: CalendarService, private calPage: Tab1Page) { }

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
        this.calService
          .createEvent(this.addEventForm.value)
          .subscribe(data => this.handleSuccess(data, formDirective), error => this.handleError(error));
      } else {
        this.calService
          .createTask(this.addEventForm.value)
          .subscribe(data => this.handleSuccess(data, formDirective), error => this.handleError(error));
      }
    }
    this.router.navigate(['/tabs/tab1']);
  }

  handleSuccess(data, formDirective) {
    console.log('OK event created', data);
    this.addEventForm.reset(); // reset inputs
    formDirective.resetForm(); // reset validation
    // this.calPage.refresh();
  }

  handleError(data) {
    console.log('KO event not created', data);
  }
}
