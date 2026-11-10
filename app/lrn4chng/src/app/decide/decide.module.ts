import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { FormsModule } from '@angular/forms';
import { DecidePage } from './decide.page';

import { DecidePageRoutingModule } from './decide-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DecidePageRoutingModule
  ],
  declarations: [DecidePage]
})
export class DecidePageModule {}
