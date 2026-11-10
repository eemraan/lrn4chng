import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../core/session';
import { ApiService, ConsentPayload } from '../core/api';

export interface ConsentResult {
  uid: string;
  email: string;
  accepted: boolean;
  language: string;
}

@Component({
  selector: 'app-english-consent',
  templateUrl: './english-consent.page.html',
  styleUrls: ['./english-consent.page.scss'],
  standalone: false
})
export class EnglishConsentPage implements OnInit {
  @Output() consentSubmitted = new EventEmitter<ConsentResult>();

  private apiService = inject(ApiService);
  private sessionService = inject(SessionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  consentForm!: FormGroup;
  selectedLanguage: string = 'en';

  /** Auto-filled consent date shown in the form text, e.g. "9 November 2026". */
  today: string = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  private languageRoutes: { [key: string]: string } = {
    en: 'english',
    fr: 'french'
  };

  ngOnInit(): void {
    // Extract language routed from previous page
    this.selectedLanguage =
      this.route.snapshot.queryParamMap.get('lang') ||
      localStorage.getItem('app_language') ||
      'en';

    this.consentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      read: [false, Validators.requiredTrue],
      understood: [false, Validators.requiredTrue],
      approved: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.consentForm.valid) {
      const payload: ConsentPayload = {
        uid: crypto.randomUUID(),
        email: this.consentForm.value.email,
        accepted: true,
        language: this.selectedLanguage
      };

      // Call API via ApiService
      this.apiService.submitConsent(payload).subscribe({
        next: (response) => {
          console.log('Consent saved:', response);

          // Store UID in session service and emit event
          this.sessionService.setUid(payload.uid);
          this.consentSubmitted.emit(payload);

          const routePrefix = this.languageRoutes[this.selectedLanguage] || this.selectedLanguage;

          // Route to intro without leaking UID in query parameters
          this.router.navigate([`/${routePrefix}-intro`], {
            queryParams: { lang: this.selectedLanguage }
          });
        },
        error: (error) => console.error('Failed to save consent:', error)
      });
    }
  }

  onDecline(): void {
    const payload: ConsentResult = {
      uid: crypto.randomUUID(),
      email: this.consentForm.get('email')?.value || '',
      accepted: false,
      language: this.selectedLanguage
    };

    this.consentSubmitted.emit(payload);
  }
}
