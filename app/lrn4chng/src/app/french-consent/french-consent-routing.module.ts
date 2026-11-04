import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrenchConsentPage } from './french-consent.page';

const routes: Routes = [
  {
    path: '',
    component: FrenchConsentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrenchConsentPageRoutingModule {}
