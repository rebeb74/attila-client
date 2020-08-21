import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';
import { GetUserResolver } from './getUser.resolver';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page,
    resolve: {
      user: GetUserResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
