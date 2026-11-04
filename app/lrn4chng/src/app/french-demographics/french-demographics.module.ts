import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { FrenchDemographicsPageRoutingModule } from './french-demographics-routing.module';

import { FrenchDemographicsPage } from './french-demographics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FrenchDemographicsPageRoutingModule
  ],
  declarations: [FrenchDemographicsPage]
})
export class FrenchDemographicsPageModule {}
