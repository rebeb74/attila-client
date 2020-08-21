import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { EditUserAccountPage } from './edit-user-account/edit-user-account.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    EditUserAccountPage,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
