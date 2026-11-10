import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';
import { ReactiveFormsModule } from '@angular/forms';
import { EnglishThankPageRoutingModule } from './english-thank-routing.module';

import { EnglishThankPage } from './english-thank.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EnglishThankPageRoutingModule
  ],
  declarations: [EnglishThankPage]
})
export class EnglishThankPageModule {}
