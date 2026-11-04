import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrenchEmailPage } from './french-email.page';

describe('FrenchEmailPage', () => {
  let component: FrenchEmailPage;
  let fixture: ComponentFixture<FrenchEmailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FrenchEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
