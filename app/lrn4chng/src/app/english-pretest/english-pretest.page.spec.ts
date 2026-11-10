import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { EnglishPretestPage } from './english-pretest.page';

describe('EnglishPretestPage', () => {
  let component: EnglishPretestPage;
  let fixture: ComponentFixture<EnglishPretestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnglishPretestPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnglishPretestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
