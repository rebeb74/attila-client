import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEventPageRoutingModule } from './add-event-routing.module';

import { AddEventPage } from './add-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEventPageRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [AddEventPage],
  entryComponents: [AddEventPage]
})
export class AddEventPageModule {}
