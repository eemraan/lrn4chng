import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrenchIntroPage } from './french-intro.page';

describe('FrenchIntroPage', () => {
  let component: FrenchIntroPage;
  let fixture: ComponentFixture<FrenchIntroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FrenchIntroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
