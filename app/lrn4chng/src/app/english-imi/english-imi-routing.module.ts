import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishImiPage } from './english-imi.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishImiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishImiPageRoutingModule {}
