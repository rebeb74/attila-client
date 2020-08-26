import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUserAccountPageRoutingModule } from './edit-user-account-routing.module';

import { EditUserAccountPage } from './edit-user-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditUserAccountPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditUserAccountPage],
  entryComponents: [EditUserAccountPage]
})
export class EditUserAccountPageModule {}
