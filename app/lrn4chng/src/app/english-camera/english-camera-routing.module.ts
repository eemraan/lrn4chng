import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnglishCameraPage } from './english-camera.page';

const routes: Routes = [
  {
    path: '',
    component: EnglishCameraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnglishCameraPageRoutingModule {}
