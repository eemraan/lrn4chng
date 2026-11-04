import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrenchDemographicsPage } from './french-demographics.page';

const routes: Routes = [
  {
    path: '',
    component: FrenchDemographicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrenchDemographicsPageRoutingModule {}
