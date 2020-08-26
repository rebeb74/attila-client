import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSharePageRoutingModule } from './edit-share-routing.module';

import { EditSharePage } from './edit-share.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditSharePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditSharePage]
})
export class EditSharePageModule {}
