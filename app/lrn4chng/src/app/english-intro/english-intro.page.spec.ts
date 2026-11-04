import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnglishIntroPage } from './english-intro.page';

describe('EnglishIntroPage', () => {
  let component: EnglishIntroPage;
  let fixture: ComponentFixture<EnglishIntroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishIntroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
