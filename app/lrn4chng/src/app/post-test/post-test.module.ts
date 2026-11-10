import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';
import { ReactiveFormsModule } from '@angular/forms';
import { PostTestPageRoutingModule } from './post-test-routing.module';

import { PostTestPage } from './post-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PostTestPageRoutingModule
  ],
  declarations: [PostTestPage]
})
export class PostTestPageModule {}
