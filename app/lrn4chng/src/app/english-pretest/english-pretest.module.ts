import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';
import { ReactiveFormsModule } from '@angular/forms';
import { EnglishPretestPageRoutingModule } from './english-pretest-routing.module';

import { EnglishPretestPage } from './english-pretest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EnglishPretestPageRoutingModule
  ],
  declarations: [EnglishPretestPage]
})
export class EnglishPretestPageModule {}
