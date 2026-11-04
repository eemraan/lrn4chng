import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';

import { EnglishConsentPageRoutingModule } from './english-consent-routing.module';
import { EnglishConsentPage } from './english-consent.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EnglishConsentPageRoutingModule
  ],
  declarations: [EnglishConsentPage]
})
export class EnglishConsentPageModule {}