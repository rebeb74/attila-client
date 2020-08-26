import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { EditUserAccountPageModule } from './edit-user-account/edit-user-account.module';
import { EditPasswordPageModule } from './edit-password/edit-password.module';
import { EditSharePageModule } from './edit-share/edit-share.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    EditUserAccountPageModule,
    EditPasswordPageModule,
    EditSharePageModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
