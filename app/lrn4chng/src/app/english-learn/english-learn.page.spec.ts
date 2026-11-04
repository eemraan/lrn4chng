import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnglishLearnPage } from './english-learn.page';

describe('EnglishLearnPage', () => {
  let component: EnglishLearnPage;
  let fixture: ComponentFixture<EnglishLearnPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishLearnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
