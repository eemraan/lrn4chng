import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishPage } from './english.page';
import { EnglishConsentPage } from './english-consent.page';

const routes: Routes = [
  {
    path: 'page',
    component: EnglishPage
  },
  {
    path: 'consent',
    component: EnglishConsentPage
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
export class EnglishPageRoutingModule {}
