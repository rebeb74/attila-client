import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSharePage } from './edit-share.page';

const routes: Routes = [
  {
    path: '',
    component: EditSharePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSharePageRoutingModule {}
