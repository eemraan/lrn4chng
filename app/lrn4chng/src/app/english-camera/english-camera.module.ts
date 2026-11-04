import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { EnglishCameraPageRoutingModule } from './english-camera-routing.module';

import { EnglishCameraPage } from './english-camera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnglishCameraPageRoutingModule
  ],
  declarations: [EnglishCameraPage]
})
export class EnglishCameraPageModule {}
