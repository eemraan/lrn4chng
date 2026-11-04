import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { FrenchEmailPageRoutingModule } from './french-email-routing.module';

import { FrenchEmailPage } from './french-email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FrenchEmailPageRoutingModule
  ],
  declarations: [FrenchEmailPage]
})
export class FrenchEmailPageModule {}
