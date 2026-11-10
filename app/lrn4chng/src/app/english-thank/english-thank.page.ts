import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SessionService } from '../core/session';
import { ApiService, ThankPayload } from '../core/api';

@Component({
  selector: 'app-english-thank',
  templateUrl: './english-thank.page.html',
  styleUrls: ['./english-thank.page.scss'],
  standalone: false,
})
export class EnglishThankPage implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private sessionService = inject(SessionService);

  thankForm!: FormGroup;
  isSubmitting: boolean = false;
  selectedLanguage: string = 'en';

  ngOnInit(): void {
    this.selectedLanguage =
      this.route.snapshot.queryParamMap.get('lang') ||
      localStorage.getItem('app_language') ||
      'en';

    this.thankForm = this.fb.group({
      opinion: [''],                       // optional open text
      willing: [null, Validators.required], // required yes/no
    });
  }

  async selectWilling(value: boolean): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.thankForm.patchValue({ willing: value });
    this.thankForm.get('willing')?.markAsTouched();
  }

  get willingMessage(): string | null {
    const willing = this.thankForm?.value?.willing;
    if (willing === true) {
      return 'Thank you! We will contact you via email. 📧';
    }
    if (willing === false) {
      return 'Thank you for your participation. 🙏';
    }
    return null;
  }

  onSubmit(): void {
    if (this.thankForm.invalid) {
      this.thankForm.markAllAsTouched();
      return;
    }

    const uid = this.sessionService.getUid();
    if (!uid) {
      console.error('No active UID found in session.');
      return;
    }

    this.isSubmitting = true;

    const payload: ThankPayload = {
      uid: uid,
      opinion: (this.thankForm.value.opinion || '').trim(),
      willing: this.thankForm.value.willing,
      language: this.selectedLanguage,
    };

    this.apiService.submitThank(payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        console.log('Thank-you responses submitted successfully:', response);

        // End of the study — fresh start for the next participant: clear cached
        // identifiers, then hard-reload the app at the language page so all
        // in-memory state (services, loaded pages) is rebuilt from scratch.
        sessionStorage.removeItem('app_uid');
        localStorage.removeItem('app_language');
        window.location.assign('/language');
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Failed to submit thank-you responses:', error);
      },
    });
  }
}
