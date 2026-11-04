import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishDemographicsPage } from './english-demographics.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishDemographicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishDemographicsPageRoutingModule {}
