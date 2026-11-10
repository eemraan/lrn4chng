import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SessionService } from '../core/session';
import { ApiService, ImiPayload } from '../core/api';

interface ImiItem {
  id: string;
  number: number;
  question: string;
}

@Component({
  selector: 'app-english-imi',
  templateUrl: './english-imi.page.html',
  styleUrls: ['./english-imi.page.scss'],
  standalone: false,
})
export class EnglishImiPage implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private sessionService = inject(SessionService);
  private toastController = inject(ToastController);

  imiForm!: FormGroup;
  isSubmitting: boolean = false;
  isSubmitted: boolean = false;
  selectedLanguage: string = 'en';
  part: number = 1;

  // Numeric 1–5 scale — values are what gets sent to the server
  readonly likertValues: number[] = [1, 2, 3, 4, 5];

  // Bold legend shown at the top of every page; colors per M27
  readonly likertLegend: { value: number; label: string; color: string }[] = [
    { value: 1, label: 'Strongly Disagree', color: '#d32f2f' },  // red
    { value: 2, label: 'Disagree',          color: '#f57c00' },  // orange
    { value: 3, label: 'Neutral',           color: '#fbc02d' },  // yellow
    { value: 4, label: 'Agree',             color: '#7cb342' },  // light green
    { value: 5, label: 'Strongly Agree',    color: '#1b5e20' },  // dark green
  ];

  // All 17 items; the page shows the slice matching its part
  private allItems: ImiItem[] = [
    // Part 1 — Interest / Enjoyment (1–5)
    { id: 'int1', number: 1, question: 'I enjoyed doing this activity very much.' },
    { id: 'int2', number: 2, question: 'This activity was fun to do.' },
    { id: 'int3', number: 3, question: 'I would describe this activity as very interesting.' },
    { id: 'int4', number: 4, question: 'I thought this activity was quite enjoyable.' },
    { id: 'int5', number: 5, question: 'While I was doing this activity, I was thinking about how much I enjoyed it.' },
    // Part 2 — Perceived Competence (6–10)
    { id: 'com1', number: 6, question: 'I think I am pretty good at this activity.' },
    { id: 'com2', number: 7, question: 'After working at this activity for a while, I felt pretty competent.' },
    { id: 'com3', number: 8, question: 'I am satisfied with my performance at this task.' },
    { id: 'com4', number: 9, question: 'I was pretty skilled at this activity.' },
    { id: 'com5', number: 10, question: "This was an activity that I couldn't do very well." },
    // Part 3 — Perceived Value / Usefulness (11–17)
    { id: 'val1', number: 11, question: 'I believe this activity could be of some value to me.' },
    { id: 'val2', number: 12, question: 'I think that doing this activity is useful for learning about climate change.' },
    { id: 'val3', number: 13, question: 'I think this is important to do because it can spread awareness and build resilience around climate issues.' },
    { id: 'val4', number: 14, question: 'I would be willing to do this again because it has some value to me.' },
    { id: 'val5', number: 15, question: 'I think doing this activity could help me to make better decisions about climate-related issues.' },
    { id: 'val6', number: 16, question: 'I believe doing this activity could be beneficial to me.' },
    { id: 'val7', number: 17, question: 'I think this is an important activity.' },
  ];

  items: ImiItem[] = [];

  ngOnInit(): void {
    // Part comes from route data: /english-imi → 1, /english-imi-2 → 2, /english-imi-3 → 3
    this.part = Number(this.route.snapshot.data['part']) || 1;

    const lengths: { [key: number]: number } = { 1: 5, 2: 5, 3: 7 };
    const start = lengths[1] + (this.part > 1 ? lengths[2] : 0) + (this.part > 2 ? lengths[3] : 0) - lengths[this.part];
    this.items = this.allItems.slice(start, start + lengths[this.part]);

    this.selectedLanguage =
      this.route.snapshot.queryParamMap.get('lang') ||
      localStorage.getItem('app_language') ||
      'en';

    const groupConfig: { [key: string]: any } = {};
    this.items.forEach((item) => {
      groupConfig[item.id] = [null, Validators.required];
    });

    this.imiForm = this.fb.group(groupConfig);
  }

  async selectLikert(itemId: string, value: number): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.imiForm.patchValue({ [itemId]: value });
    this.imiForm.get(itemId)?.markAsTouched();
  }

  onNext(): void {
    if (this.imiForm.invalid) {
      this.imiForm.markAllAsTouched();
      return;
    }

    const uid = this.sessionService.getUid();
    if (!uid) {
      console.error('No active UID found in session.');
      return;
    }

    this.isSubmitting = true;

    // Answers stored in display order (parts map to interest/competence/value)
    const answers: number[] = this.items.map((item) => Number(this.imiForm.value[item.id]));

    const payload: ImiPayload = {
      uid: uid,
      part: this.part,
      answers: answers,
      language: this.selectedLanguage,
    };

    this.apiService.submitImi(payload).subscribe({
      next: async (response: any) => {
        this.isSubmitting = false;
        console.log(`IMI part ${this.part} submitted successfully:`, response);

        if (this.part < 3) {
          this.router.navigate([`/english-imi-${this.part + 1}`], {
            queryParams: { uid: uid, lang: this.selectedLanguage }
          });
        } else {
          // Final IMI part — go to the closing thank-you page (M29)
          const toast = await this.toastController.create({
            message: 'Questionnaire recorded 🎉 Almost done!',
            duration: 2500,
            position: 'bottom',
            color: 'success',
          });
          await toast.present();

          this.router.navigate(['/english-thank'], {
            queryParams: { uid: uid, lang: this.selectedLanguage }
          });
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Failed to submit IMI part:', error);
      },
    });
  }
}
