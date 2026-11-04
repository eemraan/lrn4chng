import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular/lazy';

import { FrenchPageRoutingModule } from './french-routing.module';

import { FrenchPage } from './french.page';
import { FrenchConsentPage } from './french-consent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    FrenchPageRoutingModule
  ],
  declarations: [FrenchPage, FrenchConsentPage]
})
export class FrenchPageModule {}
