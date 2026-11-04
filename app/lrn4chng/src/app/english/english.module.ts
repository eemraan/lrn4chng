import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular/lazy';

import { EnglishPageRoutingModule } from './english-routing.module';

import { EnglishPage } from './english.page';
import { EnglishConsentPage } from './english-consent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    EnglishPageRoutingModule
  ],
  declarations: [EnglishPage, EnglishConsentPage]
})
export class EnglishPageModule {}
