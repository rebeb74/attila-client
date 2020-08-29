import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShareListPopoverPageRoutingModule } from './share-list-popover-routing.module';

import { ShareListPopoverPage } from './share-list-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareListPopoverPageRoutingModule
  ],
  declarations: [ShareListPopoverPage]
})
export class ShareListPopoverPageModule {}
