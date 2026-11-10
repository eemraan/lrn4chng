import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EnglishLearnPage } from './english-learn.page';

describe('EnglishLearnPage', () => {
  let component: EnglishLearnPage;
  let fixture: ComponentFixture<EnglishLearnPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnglishLearnPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnglishLearnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
