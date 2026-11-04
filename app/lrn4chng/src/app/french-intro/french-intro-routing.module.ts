import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrenchIntroPage } from './french-intro.page';

const routes: Routes = [
  {
    path: '',
    component: FrenchIntroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrenchIntroPageRoutingModule {}
