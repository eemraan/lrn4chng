import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrenchDemographicsPage } from './french-demographics.page';

describe('FrenchDemographicsPage', () => {
  let component: FrenchDemographicsPage;
  let fixture: ComponentFixture<FrenchDemographicsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FrenchDemographicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
