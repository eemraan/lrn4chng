import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { EnglishIntroPageRoutingModule } from './english-intro-routing.module';

import { EnglishIntroPage } from './english-intro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnglishIntroPageRoutingModule
  ],
  declarations: [EnglishIntroPage]
})
export class EnglishIntroPageModule {}
