import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { FrenchConsentPageRoutingModule } from './french-consent-routing.module';

import { FrenchConsentPage } from './french-consent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FrenchConsentPageRoutingModule
  ],
  declarations: [FrenchConsentPage]
})
export class FrenchConsentPageModule {}
