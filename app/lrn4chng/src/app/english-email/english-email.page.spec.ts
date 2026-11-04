import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnglishEmailPage } from './english-email.page';

describe('EnglishEmailPage', () => {
  let component: EnglishEmailPage;
  let fixture: ComponentFixture<EnglishEmailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
