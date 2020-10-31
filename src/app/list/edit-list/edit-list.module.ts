import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditListPageRoutingModule } from './edit-list-routing.module';

import { EditListPage } from './edit-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditListPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditListPage]
})
export class EditListPageModule {}
