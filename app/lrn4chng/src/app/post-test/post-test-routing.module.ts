import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostTestPage } from './post-test.page';

const routes: Routes = [
  {
    path: '',
    component: PostTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostTestPageRoutingModule {}
