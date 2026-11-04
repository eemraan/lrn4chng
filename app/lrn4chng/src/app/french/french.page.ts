import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-french',
  templateUrl: './french.page.html',
  styleUrls: ['./french.page.scss'],
  standalone: false
})
export class FrenchPage {
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
          ['/french', 'consent'],
          { queryParams: { uid: response.hash } }
        );
      } else {
        await this.showError('Aucun UID reçu du serveur. Veuillez réessayer.');
      }

    } catch (error) {

      console.error('Envoi de l\'email échoué :', error);
      await this.showError('Impossible de joindre le serveur. Veuillez réessayer.');

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
