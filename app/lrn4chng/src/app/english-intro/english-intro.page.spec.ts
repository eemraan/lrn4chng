import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterTestingModule } from '@angular/router/testing';

import { EnglishIntroPage } from './english-intro.page';

describe('EnglishIntroPage', () => {
  let component: EnglishIntroPage;
  let fixture: ComponentFixture<EnglishIntroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnglishIntroPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnglishIntroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
