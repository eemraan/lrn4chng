import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ApiService } from '../api'; 
import { SessionService } from '../session';

@Component({
  selector: 'app-english-camera',
  templateUrl: './english-camera.page.html',
  styleUrls: ['./english-camera.page.scss'],
  standalone: false,
})
export class EnglishCameraPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private sessionService = inject(SessionService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  receivedImageUrl: string | null = null;
  capturedPhotoWebPath: string | null = null;
  capturedPhotoBlob: Blob | null = null;

  isUploading: boolean = false;
  uploadSuccess: boolean = false;
  selectedLanguage: string = 'en';

  private languageRoutes: Record<string, string> = { en: 'english', fr: 'french' };

  ngOnInit(): void {
    // Subscribe to queryParamMap so it updates even if navigating back with new params
    this.route.queryParamMap.subscribe((params) => {
      const rawUrl = params.get('imageUrl');
      this.selectedLanguage = params.get('lang') || 'en';

      if (rawUrl) {
        this.receivedImageUrl = this.appendCacheBuster(rawUrl);
      } else {
        this.receivedImageUrl = null;
      }
      
      this.cdr.detectChanges();
    });
  }

  /**
   * Appends a timestamp parameter to force browser image cache invalidation.
   */
  private appendCacheBuster(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  }

  async takePhoto(): Promise<void> {
    try {
      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath) {
        this.capturedPhotoWebPath = image.webPath;
        const response = await fetch(image.webPath);
        this.capturedPhotoBlob = await response.blob();
        
        this.zone.run(() => {
          this.uploadSuccess = false;
          this.cdr.detectChanges();
        });
      }
    } catch (error) {
      console.error('User cancelled camera or error occurred:', error);
    }
  }

  uploadPhoto(): void {
    if (!this.capturedPhotoBlob) {
      console.warn('No photo captured to upload.');
      return;
    }

    const uid = this.sessionService.getUid() || this.route.snapshot.queryParamMap.get('uid');

    if (!uid) {
      console.error('No active UID found for photo upload.');
      return;
    }

    this.isUploading = true;

    this.apiService.uploadCameraImage(this.capturedPhotoBlob, uid).subscribe({
      next: (res) => {
        console.log('Photo uploaded successfully to FastAPI:', res);

        this.zone.run(() => {
          this.isUploading = false;
          this.uploadSuccess = true;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error uploading photo to FastAPI:', err);

        this.zone.run(() => {
          this.isUploading = false;
          this.uploadSuccess = false;
          this.cdr.detectChanges();
        });
      },
    });
  }

  goToNextPage(): void {
    const uid = this.sessionService.getUid() || this.route.snapshot.queryParamMap.get('uid');
    const routePrefix = this.languageRoutes[this.selectedLanguage] || this.selectedLanguage;

    this.router.navigate([`/${routePrefix}-learn`], {
      queryParams: { lang: this.selectedLanguage, uid: uid },
    });
  }
}