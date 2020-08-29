import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareListPopoverPage } from './share-list-popover.page';

const routes: Routes = [
  {
    path: '',
    component: ShareListPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareListPopoverPageRoutingModule {}
