import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditUserAccountPage } from './edit-user-account.page';

const routes: Routes = [
  {
    path: '',
    component: EditUserAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUserAccountPageRoutingModule {}
