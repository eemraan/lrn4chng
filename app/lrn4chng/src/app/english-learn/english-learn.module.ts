import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { EnglishLearnPageRoutingModule } from './english-learn-routing.module';

import { EnglishLearnPage } from './english-learn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnglishLearnPageRoutingModule
  ],
  declarations: [EnglishLearnPage]
})
export class EnglishLearnPageModule {}
