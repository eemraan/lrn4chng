import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishConsentPage } from './english-consent.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishConsentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishConsentPageRoutingModule {}
