import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrenchEmailPage } from './french-email.page';

const routes: Routes = [
  {
    path: '',
    component: FrenchEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrenchEmailPageRoutingModule {}
