import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishCltPage } from './english-clt.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishCltPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishCltPageRoutingModule {}
