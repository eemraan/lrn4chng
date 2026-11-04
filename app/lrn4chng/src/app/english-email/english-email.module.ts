import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { EnglishEmailPageRoutingModule } from './english-email-routing.module';

import { EnglishEmailPage } from './english-email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnglishEmailPageRoutingModule
  ],
  declarations: [EnglishEmailPage]
})
export class EnglishEmailPageModule {}
