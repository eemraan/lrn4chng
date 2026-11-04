import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishLearnPage } from './english-learn.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishLearnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishLearnPageRoutingModule {}
