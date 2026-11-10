import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { EnglishCltPage } from './english-clt.page';

describe('EnglishCltPage', () => {
  let component: EnglishCltPage;
  let fixture: ComponentFixture<EnglishCltPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnglishCltPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnglishCltPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
