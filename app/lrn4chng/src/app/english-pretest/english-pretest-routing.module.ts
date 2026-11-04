import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishPretestPage } from './english-pretest.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishPretestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishPretestPageRoutingModule {}
