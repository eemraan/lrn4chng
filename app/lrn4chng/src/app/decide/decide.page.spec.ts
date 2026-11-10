import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterTestingModule } from '@angular/router/testing';

import { DecidePage } from './decide.page';

describe('DecidePage', () => {
  let component: DecidePage;
  let fixture: ComponentFixture<DecidePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DecidePage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DecidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
