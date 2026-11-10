import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecidePage } from './decide.page';

const routes: Routes = [
  {
    path: '',
    component: DecidePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DecidePageRoutingModule {}
