import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SessionService } from '../core/session';
import { ApiService, DemographicsPayload } from '../core/api'; // Adjust relative path if needed

@Component({
  selector: 'app-english-demographics',
  templateUrl: './english-demographics.page.html',
  styleUrls: ['./english-demographics.page.scss'],
  standalone: false,
})
export class EnglishDemographicsPage implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private sessionService = inject(SessionService);

  demoForm!: FormGroup;
  selectedLanguage: string = 'en';
  isSubmitting: boolean = false;

  private languageRoutes: { [key: string]: string } = {
    en: 'english',
    fr: 'french'
  };

  // Likert options for GenAI familiarity
  likertOptions = [
    { value: 1, label: 'Never Used', description: 'No experience' },
    { value: 2, label: 'Beginner', description: 'Used a few times' },
    { value: 3, label: 'Moderate', description: 'Occasional user' },
    { value: 4, label: 'Frequent', description: 'Regular user' },
    { value: 5, label: 'Expert', description: 'Daily power user' }
  ];

  ngOnInit(): void {
    this.selectedLanguage =
      this.route.snapshot.queryParamMap.get('lang') ||
      localStorage.getItem('app_language') ||
      'en';

    this.demoForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(10), Validators.max(100)]],
      gender: ['', Validators.required],
      status: ['student', Validators.required],
      majorOrProfession: ['', [Validators.required, Validators.minLength(2)]],
      affiliation: ['', [Validators.required, Validators.minLength(2)]],
      genAiFamiliarity: [null, Validators.required],
      nativeCountry: ['', Validators.required]
    });
  }

  async selectLikert(value: number) {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.demoForm.patchValue({ genAiFamiliarity: value });
    this.demoForm.get('genAiFamiliarity')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.demoForm.invalid) {
      this.demoForm.markAllAsTouched();
      return;
    }

    const uid = this.sessionService.getUid();
    if (!uid) {
      console.error('No active UID found in session.');
      return;
    }

    this.isSubmitting = true;

    const payload: DemographicsPayload = {
      uid: uid,
      age: Number(this.demoForm.value.age),
      gender: this.demoForm.value.gender,
      status: this.demoForm.value.status,
      majorOrProfession: this.demoForm.value.majorOrProfession,
      affiliation: this.demoForm.value.affiliation,
      genAiFamiliarity: Number(this.demoForm.value.genAiFamiliarity),
      nativeCountry: this.demoForm.value.nativeCountry,
      language: this.selectedLanguage
    };

    this.apiService.submitDemographics(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        console.log('Demographics saved successfully:', response);

        const routePrefix = this.languageRoutes[this.selectedLanguage] || this.selectedLanguage;

        // Navigate to the interactive Instructions Page
        this.router.navigate([`/${routePrefix}-pretest`], {
          queryParams: { lang: this.selectedLanguage }
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Failed to save demographics:', error);
      }
    });
  }
}