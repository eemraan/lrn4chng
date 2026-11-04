import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrenchPage } from './french.page';
import { FrenchConsentPage } from './french-consent.page';

const routes: Routes = [
  {
    path: 'page',
    component: FrenchPage
  },
  {
    path: 'consent',
    component: FrenchConsentPage
  },
  {
    path: '',
    redirectTo: 'page',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrenchPageRoutingModule {}
