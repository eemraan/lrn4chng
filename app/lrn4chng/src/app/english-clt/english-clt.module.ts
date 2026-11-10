import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';
import { ReactiveFormsModule } from '@angular/forms';
import { EnglishCltPageRoutingModule } from './english-clt-routing.module';

import { EnglishCltPage } from './english-clt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EnglishCltPageRoutingModule
  ],
  declarations: [EnglishCltPage]
})
export class EnglishCltPageModule {}
