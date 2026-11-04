import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishEmailPage } from './english-email.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishEmailPageRoutingModule {}
