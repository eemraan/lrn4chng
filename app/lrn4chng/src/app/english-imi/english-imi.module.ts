import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';
import { ReactiveFormsModule } from '@angular/forms';
import { EnglishImiPageRoutingModule } from './english-imi-routing.module';

import { EnglishImiPage } from './english-imi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EnglishImiPageRoutingModule
  ],
  declarations: [EnglishImiPage]
})
export class EnglishImiPageModule {}
