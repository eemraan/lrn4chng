import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnglishDemographicsPage } from './english-demographics.page';

describe('EnglishDemographicsPage', () => {
  let component: EnglishDemographicsPage;
  let fixture: ComponentFixture<EnglishDemographicsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishDemographicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
