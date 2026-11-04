import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { FrenchIntroPageRoutingModule } from './french-intro-routing.module';

import { FrenchIntroPage } from './french-intro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FrenchIntroPageRoutingModule
  ],
  declarations: [FrenchIntroPage]
})
export class FrenchIntroPageModule {}
