import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { EnglishDemographicsPage } from './english-demographics.page';

describe('EnglishDemographicsPage', () => {
  let component: EnglishDemographicsPage;
  let fixture: ComponentFixture<EnglishDemographicsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnglishDemographicsPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnglishDemographicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
