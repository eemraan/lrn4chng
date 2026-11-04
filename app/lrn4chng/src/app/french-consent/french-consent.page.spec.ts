import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrenchConsentPage } from './french-consent.page';

describe('FrenchConsentPage', () => {
  let component: FrenchConsentPage;
  let fixture: ComponentFixture<FrenchConsentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FrenchConsentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
