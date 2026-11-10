import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishThankPage } from './english-thank.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishThankPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishThankPageRoutingModule {}
