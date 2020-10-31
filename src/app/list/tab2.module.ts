import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { EditListPageModule } from './edit-list/edit-list.module';
import { AddListPageModule } from './add-list/add-list.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    EditListPageModule,
    AddListPageModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }]),
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
