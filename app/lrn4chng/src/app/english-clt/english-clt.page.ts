import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SessionService } from '../core/session';
import { ApiService, CltPayload } from '../core/api';

interface CltItem {
  id: string;
  number: number;
  question: string;
}

@Component({
  selector: 'app-english-clt',
  templateUrl: './english-clt.page.html',
  styleUrls: ['./english-clt.page.scss'],
  standalone: false,
})
export class EnglishCltPage implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private sessionService = inject(SessionService);
  private toastController = inject(ToastController);

  cltForm!: FormGroup;
  isSubmitting: boolean = false;
  isSubmitted: boolean = false;
  selectedLanguage: string = 'en';
  part: number = 1;

  // Numeric 1–5 scale — values are what gets sent to the server
  readonly likertValues: number[] = [1, 2, 3, 4, 5];

  // Bold legend shown at the top of every page (M25); colors added in M27
  readonly likertLegend: { value: number; label: string; color: string }[] = [
    { value: 1, label: 'Strongly Disagree', color: '#d32f2f' },  // red
    { value: 2, label: 'Disagree',          color: '#f57c00' },  // orange
    { value: 3, label: 'Neutral',           color: '#fbc02d' },  // yellow
    { value: 4, label: 'Agree',             color: '#7cb342' },  // light green
    { value: 5, label: 'Strongly Agree',    color: '#1b5e20' },  // dark green
  ];

  // All 15 items; the page shows the slice matching its part
  private allItems: CltItem[] = [
    // Part 1 — Intrinsic Cognitive Load (1–5)
    { id: 'icl1', number: 1, question: 'The learning content was difficult to understand' },
    { id: 'icl2', number: 2, question: 'The explanations of the learning content were difficult to understand' },
    { id: 'icl3', number: 3, question: 'The learning contents were complex' },
    { id: 'icl4', number: 4, question: 'The learning content included much complex information' },
    { id: 'icl5', number: 5, question: 'Without prior knowledge, the information was not understandable' },
    // Part 2 — Extraneous Cognitive Load (6–10)
    { id: 'ecl1', number: 6, question: 'It was difficult to gain an overview of the structure of the learning material' },
    { id: 'ecl2', number: 7, question: 'The design of the learning material made it difficult to recognise links between individual information units' },
    { id: 'ecl3', number: 8, question: 'The design of the learning material was inconvenient' },
    { id: 'ecl4', number: 9, question: 'The design of the learning material made it difficult to find relevant information quickly' },
    { id: 'ecl5', number: 10, question: 'Because of the design of the learning material, I had the impression that I could not concentrate on the learning content' },
    // Part 3 — Germane Cognitive Load (11–15)
    { id: 'gcl1', number: 11, question: 'I actively reflected on the learning content' },
    { id: 'gcl2', number: 12, question: 'I made an effort to understand the learning content' },
    { id: 'gcl3', number: 13, question: 'I achieved a comprehensive understanding of the learning content' },
    { id: 'gcl4', number: 14, question: 'I was able to expand my prior knowledge with the learning content' },
    { id: 'gcl5', number: 15, question: 'I can apply the knowledge that I acquired through the learning material quickly and accurately' },
  ];

  items: CltItem[] = [];

  ngOnInit(): void {
    // Part comes from route data: /english-clt → 1, /english-clt-2 → 2, /english-clt-3 → 3
    this.part = Number(this.route.snapshot.data['part']) || 1;

    const start = (this.part - 1) * 5;
    this.items = this.allItems.slice(start, start + 5);

    this.selectedLanguage =
      this.route.snapshot.queryParamMap.get('lang') ||
      localStorage.getItem('app_language') ||
      'en';

    const groupConfig: { [key: string]: any } = {};
    this.items.forEach((item) => {
      groupConfig[item.id] = [null, Validators.required];
    });

    this.cltForm = this.fb.group(groupConfig);
  }

  async selectLikert(itemId: string, value: number): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.cltForm.patchValue({ [itemId]: value });
    this.cltForm.get(itemId)?.markAsTouched();
  }

  onNext(): void {
    if (this.cltForm.invalid) {
      this.cltForm.markAllAsTouched();
      return;
    }

    const uid = this.sessionService.getUid();
    if (!uid) {
      console.error('No active UID found in session.');
      return;
    }

    this.isSubmitting = true;

    // Answers stored in display order (parts 1–3 map to ICL/ECL/GCL)
    const answers: number[] = this.items.map((item) => Number(this.cltForm.value[item.id]));

    const payload: CltPayload = {
      uid: uid,
      part: this.part,
      answers: answers,
      language: this.selectedLanguage,
    };

    this.apiService.submitClt(payload).subscribe({
      next: async (response: any) => {
        this.isSubmitting = false;
        console.log(`CLT part ${this.part} submitted successfully:`, response);

        if (this.part < 3) {
          this.router.navigate([`/english-clt-${this.part + 1}`], {
            queryParams: { uid: uid, lang: this.selectedLanguage }
          });
        } else {
          // Final part — CLT complete, continue to the motivation questionnaire
          // and then the closing thank-you page (M28/M29)
          const toast = await this.toastController.create({
            message: 'CLT recorded 🎉 One last questionnaire!',
            duration: 2500,
            position: 'bottom',
            color: 'success',
          });
          await toast.present();

          this.router.navigate(['/english-imi'], {
            queryParams: { uid: uid, lang: this.selectedLanguage }
          });
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Failed to submit CLT part:', error);
      },
    });
  }
}
