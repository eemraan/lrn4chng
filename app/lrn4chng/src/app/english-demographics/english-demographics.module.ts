import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';
import { ReactiveFormsModule } from '@angular/forms';

import { EnglishDemographicsPageRoutingModule } from './english-demographics-routing.module';

import { EnglishDemographicsPage } from './english-demographics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EnglishDemographicsPageRoutingModule
  ],
  declarations: [EnglishDemographicsPage]
})
export class EnglishDemographicsPageModule {}
