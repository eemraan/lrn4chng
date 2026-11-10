import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EnglishCameraPage } from './english-camera.page';

describe('EnglishCameraPage', () => {
  let component: EnglishCameraPage;
  let fixture: ComponentFixture<EnglishCameraPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnglishCameraPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnglishCameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
