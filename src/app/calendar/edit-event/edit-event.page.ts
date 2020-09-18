import { Component, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { ModalController } from '@ionic/angular';
import { Task, Event } from 'src/app/models/event';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {
  @Input() event: Event;
  @Input() task: Task;
  @Input() currentCalUsername: string;
  @Input() shareList: [];
  shareListTemp: [] = [];
  editEventForm: FormGroup;
  currentEvent: Event;
  currentTask: Task;
  typeEvent: string;

  constructor(
    private fb: FormBuilder,
    public modalController: ModalController,
    calService: CalendarService
  ) { }

  ngOnInit() {
    this.createForm();
    this.onRepeatChange();
    this.setShareList();
  }

  createForm() {
    if (this.event !== undefined) {
      this.currentEvent = this.event;
      this.editEventForm = this.fb.group({
        title: this.currentEvent.title,
        description: this.currentEvent.description,
        startTime: this.currentEvent.startTime,
        startHour: this.currentEvent.startHour,
        place: this.currentEvent.place,
        alert: this.currentEvent.alert
      });
      this.typeEvent = 'rdv';
    } else if (this.task !== undefined) {
      this.currentTask = this.task;
      this.editEventForm = this.fb.group({
        title: this.currentTask.title,
        description: this.currentTask.description,
        startTime: this.currentTask.startTime,
        repeat: this.currentTask.repeat,
        altern: this.currentTask.altern,
      });
      this.typeEvent = 'task';
    }
  }

  get f() { return this.editEventForm.controls; }

  typeEventChange($event) {
    this.typeEvent = $event.detail.value;
  }

  onRepeatChange() {
    if (this.typeEvent === 'task') {
      if(this.editEventForm.get('altern').value === '0'){
        this.editEventForm.get('altern').disable();
      }
      this.editEventForm.get('repeat').valueChanges
        .subscribe(repeatValue => {

          if (repeatValue === '0') {
            this.editEventForm.get('altern').reset();
            this.editEventForm.get('altern').disable();
          } else {
            this.editEventForm.get('altern').enable();
          }

        });
    }
  }

  async myDismiss() {
    let editedEvent: Array<object>;
    if (this.typeEvent === 'rdv'){
      editedEvent = [
        {
          _id: this.currentEvent._id,
          title: this.f.title.value,
          description: this.f.description.value,
          startTime: this.f.startTime.value,
          startHour: this.f.startHour.value,
          place: this.f.place.value,
          alert: this.f.alert.value,
        },
        {
          typeEvent: this.typeEvent
        }
      ];
    } else if (this.typeEvent === 'task'){
        editedEvent = [
          {
            _id: this.currentTask._id,
            title: this.f.title.value,
            description: this.f.description.value,
            startTime: this.f.startTime.value,
            repeat: this.f.repeat.value || '',
            altern: this.f.altern.value || '',
          },
          {
            typeEvent: this.typeEvent
          }
        ];

    }
    await this.modalController.dismiss(editedEvent);
  }

  setShareList(){
    console.log('this.shareList', this.shareList);
    this.shareList.forEach((element, index) => {
      if (index !== 0) {
        this.shareListTemp.push(element);
      }
    });
  }
}
