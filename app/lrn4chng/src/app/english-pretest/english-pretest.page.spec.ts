import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnglishPretestPage } from './english-pretest.page';

describe('EnglishPretestPage', () => {
  let component: EnglishPretestPage;
  let fixture: ComponentFixture<EnglishPretestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishPretestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
