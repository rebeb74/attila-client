import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';
import { CalendarTasksResolver } from './calendarTasks.resolver';
import { CalendarEventsResolver } from './calendarEvents.resolver';
import { GetUserResolver } from '../getUser.resolver';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
    resolve: {
      event: CalendarEventsResolver,
      task: CalendarTasksResolver,
      user: GetUserResolver
    }
  },
  {
    path: 'add-event',
    loadChildren: () => import('./add-event/add-event.module').then( m => m.AddEventPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
