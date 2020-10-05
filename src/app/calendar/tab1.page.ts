import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { CalendarComponentOptions, CalendarComponent, DayConfig } from './ion2-calendar';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent } from '@angular/router';
import { CalendarService } from '../services/calendar.service';
import { Event, Task } from '../models/event';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { filter, subscribeOn } from 'rxjs/operators';
import { User } from '../models/user';
import { PopoverController, ModalController } from '@ionic/angular';
import { ShareListPopoverPage } from './share-list-popover/share-list-popover.page';
import { OverlayEventDetail } from '@ionic/core';
import { EditEventPage } from './edit-event/edit-event.page';

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
  selectedDay = new Date();
  userEvents: Event[];
  userTasks: Task[];
  shareUserEvents: Event[];
  shareUserTasks: Task[];
  daysConfig: DayConfig[] = [];
  daysConfigSubcription: Subscription;
  optionsRangeSubcription: Subscription;
  optionsRange: CalendarComponentOptions;
  dayEvents = [];
  dayTasks = [];
  currentMonthView: string;
  monthSelectDay: string;
  currentUser: User;
  shareList = [];
  currentCalUsername: string;

  constructor(
    private calService: CalendarService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    public popoverController: PopoverController
  ) {
    // Moment locale configuration
    moment.locale('fr-ch');
    // Refresh When navigate to this page
    this.router.events.pipe(
      filter((events: RouterEvent) => events instanceof NavigationEnd),
    ).subscribe((val) => {
      if (val.url === '/tabs/tab1') {
        this.refresh();
        this.showEventsList(this.selectedDay);
      }
    });
  }

  ngOnInit(): void {
    // Get Current User
    this.getCurrentUser();
    // Configure Share List
    this.setShareList();
    // Configure Calendar
    this.initOptionsRange();
    this.loadEvents();
    this.loadTasks();
  }

  getCurrentUser() {
    this.route.data.subscribe((data: { user: User }) => {
      this.currentUser = data.user;
      console.log(this.currentUser);
    });
  }

  setShareList() {
    this.shareList.push({
      userId: this.currentUser._id,
      username: this.currentUser.username,
      email: this.currentUser.email
    });
    this.calService.setCurrentCalUsername(this.shareList[0].username);
    this.currentCalUsername = this.shareList[0].username;
    this.currentUser.share.forEach((shareUser) => {
      this.currentUser.isShared.forEach((isSharedUser) => {
        if (shareUser.username === isSharedUser.username) {
          this.shareList.push({
            userId: shareUser.id,
            username: shareUser.username,
            email: shareUser.email
          });
        }
      });
    });
    this.calService.setShareList(this.shareList);
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
    console.log('this.userEvents', this.userEvents);
  }

  loadShareUserEvents(shareUser) {
    this.apiService.getShareEventsByUserId(shareUser).subscribe(
      (success) => {
        console.log('resultat requete event', success);
        this.shareUserEvents = success;
        this.daysConfig = [];
        this.addDaysConfig(success);
      },
      (error) => {
        console.log('error requete', error);

      });
  }

  loadShareUserTasks(shareUser) {
    this.apiService.getShareTasksByUserId(shareUser).subscribe(
      (success) => {
        console.log('resultat requete task', success);
        this.shareUserTasks = success;
        this.addDaysConfig(success);
      },
      (error) => {
        console.log('error requete', error);

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

  async presentPopoverShareList(ev: any) {
    const popover = await this.popoverController.create({
      component: ShareListPopoverPage,
      translucent: true,
      event: ev,
      componentProps: { shareList: this.shareList }
    });

    popover.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        this.shareList.forEach((shareUser) => {
          if (shareUser.username === detail.data) {
            this.daysConfig = [];
            this.calService.setCurrentCalUsername(shareUser.username);
            this.currentCalUsername = shareUser.username;
            if (shareUser.username === this.currentUser.username) {
              this.loadEvents();
              this.loadTasks();
              this.refresh();
              this.showEventsList(this.selectedDay);
            } else {
              this.loadShareUserEvents(shareUser.userId);
              this.loadShareUserTasks(shareUser.userId);
              setTimeout(() => {
                this.refresh();
                this.showEventsList(this.selectedDay);
              }, 1000);
            }
          }
        });
      }
    });
    await popover.present();
  }

  onChange($event) {
    this.dayEvents = [];
    this.dayTasks = [];
    this.selectedDay = $event._d;
    this.calService.setSelectedDay(this.selectedDay);
    this.currentMonthView = moment($event._d).format('MMMM YYYY');
    this.showEventsList(this.selectedDay);
  }

  onMonthChange($events) {
    this.monthSelectDay = $events.newMonth.dateObj;
    if (moment($events.newMonth.dateObj).format('MMMM YYYY') !== this.currentMonthView) {
      this.showEventsList(this.monthSelectDay);
      this.refresh();
    } else {
      this.showEventsList(this.selectedDay);
      this.refresh();
    }
  }

  addDaysConfig(data) {
    data.forEach(element => {
      this.daysConfig.push({
        date: new Date(element.startTime),
        subTitle: '●',
        marked: false,
        disable: false
      });
    });
  }

  updateDaysConfig(userTasks, userEvents) {
    console.log('this.userTasks2', [...this.userTasks]);
    this.daysConfig = [];
    this.addDaysConfig(userTasks);
    this.addDaysConfig(userEvents);
  }

  showEventsList(day) {
    this.dayEvents = [];
    this.dayTasks = [];
    let isCurrentUser = false;
    if (this.currentUser.username === this.currentCalUsername) {
      isCurrentUser = true;
    }
    if (isCurrentUser) {
      this.userEvents.forEach(e => {
        if (new Date(e.startTime).toString().substring(4, 15) === new Date(day).toString().substring(4, 15)) {
          this.dayEvents.push(e);
        }
      });
      this.userTasks.forEach(e => {
        if (new Date(e.startTime).toString().substring(4, 15) === new Date(day).toString().substring(4, 15)) {
          this.dayTasks.push(e);
        }
      });
    } else {
      if (this.shareUserEvents !== undefined) {
        this.shareUserEvents.forEach(e => {
          if (new Date(e.startTime).toString().substring(4, 15) === new Date(day).toString().substring(4, 15)) {
            this.dayEvents.push(e);
          }
        });
      }
      if (this.shareUserTasks !== undefined) {
        this.shareUserTasks.forEach(e => {
          if (new Date(e.startTime).toString().substring(4, 15) === new Date(day).toString().substring(4, 15)) {
            this.dayTasks.push(e);
          }
        });
      }

      console.log('this.shareUserTasks', this.shareUserTasks);
      console.log('this.dayTasks', this.dayTasks);
    }
  }

  deleteEvent(id) {
    this.userEvents.forEach((e, index) => {
      if (e._id === id) {
        // Delete database
        this.apiService.deleteEventById(id).subscribe();
        // update userEvents
        this.userEvents.splice(index, 1);
        // update daysConfig
        this.updateDaysConfig(this.userTasks, this.userEvents);
      }
    });
    this.showEventsList(this.selectedDay);
    this.refresh();
  }

  deleteTask(id) {
    this.userTasks.forEach((task, index) => {
      if (task._id === id) {
        // Delete database
        this.apiService.deleteTaskById(id).subscribe();
        // update userEvents
        this.userTasks.splice(index, 1);
        // update daysConfig
        this.updateDaysConfig(this.userTasks, this.userEvents);
      }
    });
    this.showEventsList(this.selectedDay);
    this.refresh();
  }

  repeatTask(id) {
    this.userTasks.forEach((task, index) => {
      if (task._id === id) {
        const newDate = moment(task.startTime).add(task.repeat, 'week').format('YYYY-MM-DD');
        // update date
        task.startTime = newDate;

        if (task.altern !== '') {
          // Delete task on database
          this.apiService.deleteTaskById(id).subscribe(
            () => {
              console.log(`task deleted for user ${task.userId}`);
            },
            (error) => {
              console.log('error : task not deleted', error);
            }
          );

          // Create task on share user database
          this.shareList.forEach((shareUser) => {
            if (shareUser.username === task.altern) {
              task.altern = this.currentUser.username;
              task.userId = shareUser.userId;
              task._id = null;
              this.apiService.createTaskByUserId(shareUser.userId, task).subscribe(
                () => {
                  console.log(`task created for user ${shareUser.userId}`);
                },
                (error) => {
                  console.log('error : task not created', error);
                }
              );
            }
          });

          // Update this.userTasks
          this.userTasks.splice(index, 1);

        } else {
          // Update database
          this.apiService.updateTaskById(
            id,
            {
              ...task,
              startTime: newDate,
              userId: task.userId
            }
          ).subscribe(
            () => {
              console.log(`task updated`);
            },
            (error) => {
              console.log('error : task not updated', error);
            }
          );

        }

        // update _daysConfig
        this.updateDaysConfig(this.userTasks, this.userEvents);
      }
    });
    this.showEventsList(this.selectedDay);
    this.refresh();
  }

  onEventClick(id, typeEvent) {
    if (this.currentCalUsername === this.currentUser.username) {
      if (typeEvent === 'rdv') {
        this.userEvents.forEach((event) => {
          if (event._id === id) {
            this.openModalEditEvent(event, undefined);
          }
        });
      } else if (typeEvent === 'task') {
        this.userTasks.forEach((task) => {
          if (task._id === id) {
            this.openModalEditEvent(undefined, task);
          }
        });
      }
    }
  }

  async openModalEditEvent(event, task) {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: EditEventPage,
        componentProps: {
          event,
          task,
          currentCalUsername: this.currentCalUsername,
          shareList: this.shareList
        }
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        console.log('The result:', detail.data);
        const typeEvent = detail.data[1].typeEvent;
        if (typeEvent === 'rdv') {
          const editedEvent = detail.data[0];
          this.apiService.updateEventById(editedEvent._id, editedEvent).subscribe(
            (success) => {
              this.userEvents.forEach((e, index) => {
                if (e._id === editedEvent._id) {
                  this.userTasks.splice(index, 1);
                }
              });
              this.userTasks.push(editedEvent);
              console.log('this.userEvents', this.userEvents);
              this.updateDaysConfig(this.userTasks, this.userEvents);
              this.showEventsList(this.selectedDay);
              this.refresh();
            },
            (error) => {
              console.log('error', error);
            }
          );
        } else if (typeEvent === 'task') {
          const editedTask = detail.data[0];
          this.apiService.updateTaskById(editedTask._id, editedTask).subscribe(
            (success) => {
              this.userTasks.forEach((t, index) => {
                if (t._id === editedTask._id) {
                  this.userTasks.splice(index, 1);
                }
              });
              this.userTasks.push(editedTask);
              console.log('this.userTasks3', this.userTasks);
              this.updateDaysConfig(this.userTasks, this.userEvents);
              this.showEventsList(this.selectedDay);
              this.refresh();
            },
            (error) => {
              console.log('error', error);
            }
          );
        }
      }
    });
    await modal.present();
  }

}
