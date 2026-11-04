import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnglishCameraPage } from './english-camera.page';

describe('EnglishCameraPage', () => {
  let component: EnglishCameraPage;
  let fixture: ComponentFixture<EnglishCameraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishCameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
