import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListResolver } from './list.resolver';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
    resolve: {
      list: ListResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
