import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { CalendarModule } from './ion2-calendar';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ShareListPopoverPageModule } from './share-list-popover/share-list-popover.module';
import { EditEventPageModule } from './edit-event/edit-event.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ShareListPopoverPageModule,
    EditEventPageModule,
    CalendarModule.forRoot({
      doneLabel: 'Save',
      closeIcon: true
    }),
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
