import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-english',
  templateUrl: './english.page.html',
  styleUrls: ['./english.page.scss'],
  standalone: false
})
export class EnglishPage {
  email: string = '';
  submitting: boolean = false;

  private readonly emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private router = inject(Router);
  private http = inject(HttpClient);
  private toastController = inject(ToastController);

  get emailValid(): boolean {
    return this.emailPattern.test(this.email.trim());
  }

  async submitEmail() {
    if (!this.emailValid || this.submitting) {
      return;
    }

    this.submitting = true;

    try {

      const response = await this.http
        .post<{ email: string; hash: string }>(
          environment.emailApiUrl,
          { email: this.email.trim() }
        )
        .toPromise();

      if (response?.hash) {

        await Haptics.impact({ style: ImpactStyle.Light });

        await this.router.navigate(
          ['/english', 'consent'],
          { queryParams: { uid: response.hash } }
        );
      } else {
        await this.showError('No UID received from server. Please try again.');
      }

    } catch (error) {

      console.error('Email submission failed:', error);
      await this.showError('Could not reach the server. Please try again.');

    } finally {

      this.submitting = false;
    }
  }

  private async showError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      cssClass: 'language-toast'
    });
    await toast.present();
  }
}
