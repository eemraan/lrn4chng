import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnglishConsentPage } from './english-consent.page';

describe('EnglishConsentPage', () => {
  let component: EnglishConsentPage;
  let fixture: ComponentFixture<EnglishConsentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishConsentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
