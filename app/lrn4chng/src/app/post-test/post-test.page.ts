import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SessionService } from '../core/session';
import { ApiService, PosttestPayload } from '../core/api';
interface QuestionConfig {
  id: string;
  question: string;
  correctAnswer: boolean | string;
}

interface McqQuestionConfig extends QuestionConfig {
  options: { label: string; value: string; text: string }[];
}

@Component({
  selector: 'app-post-test',
  templateUrl: './post-test.page.html',
  styleUrls: ['./post-test.page.scss'],
  standalone: false,
})
export class PostTestPage implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private sessionService = inject(SessionService);
  private toastController = inject(ToastController);

  quizForm!: FormGroup;
  isSubmitting: boolean = false;
  isSubmitted: boolean = false;
  selectedLanguage: string = 'en';

  private languageRoutes: { [key: string]: string } = {
    en: 'english',
    fr: 'french'
  };

  tfQuestions: QuestionConfig[] = [
    {
      id: 'q1',
      question: 'Plants and trees enter a dormant state, sometimes called dormancy, during autumn.',
      correctAnswer: true,
    },
    {
      id: 'q2',
      question: 'Photosynthesis is the process by which plants and trees produce energy in the form of sugar.',
      correctAnswer: true,
    },
    {
      id: 'q3',
      question: 'CO₂ emissions generally increase in summer and decrease in winter.',
      correctAnswer: false,
    },
    {
      id: 'q4',
      question: 'Evergreen trees (trees that retain their leaves throughout the year) function in the same way throughout all seasons',
      correctAnswer: false,
    },
  ];

  mcqQuestions: McqQuestionConfig[] = [
    {
      id: 'q5',
      question: 'What does a tree or plant need for effective photosynthesis?',
      correctAnswer: 'co2',
      options: [
        { label: 'A', value: 'o2', text: 'Sunlight, oxygen, and carbon dioxide (CO₂).' },
        { label: 'B', value: 'co2', text: 'Sunlight, water, and carbon dioxide (CO₂).' },
        { label: 'C', value: 'water', text: 'Water, CO2, and soil nutrients.' },
        { label: 'D', value: 'not_sure', text: 'Not Sure' },
      ],
    },
    {
      id: 'q6',
      question: 'What is the main driving factor behind the increase in CO₂ emissions during winter?',
      correctAnswer: 'energy',
      options: [
        { label: 'A', value: 'energy', text: 'Increased heating demand, which leads to greater fuel consumption in buildings.' },
        { label: 'B', value: 'photo', text: 'Decreased photosynthesis, which releases more CO₂ into the atmosphere.' },
        { label: 'C', value: 'transport', text: 'Increased water absorption by trees, which releases more CO₂ into the atmosphere.' },
        { label: 'D', value: 'not_sure', text: 'Not Sure' },
      ],
    },
  ];

  ngOnInit(): void {
    this.selectedLanguage =
      this.route.snapshot.queryParamMap.get('lang') ||
      localStorage.getItem('app_language') ||
      'en';

    const groupConfig: { [key: string]: any } = {};

    this.tfQuestions.forEach((q) => {
      groupConfig[q.id] = [null, Validators.required];
    });

    this.mcqQuestions.forEach((q) => {
      groupConfig[q.id] = [null, Validators.required];
    });

    this.quizForm = this.fb.group(groupConfig);
  }

  async selectMcqOption(questionId: string, optionValue: string) {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.quizForm.patchValue({ [questionId]: optionValue });
    this.quizForm.get(questionId)?.markAsTouched();
  }

  /**
   * Evaluates form values against answer keys to build the score array:
   * 1 = Correct, 0 = Incorrect, -1 = Not Sure
   */
  private evaluateAnswers(): number[] {
    const scores: number[] = [];

    // Evaluate Q1 to Q4 (True / False)
    this.tfQuestions.forEach((q) => {
      const userVal = this.quizForm.value[q.id];
      if (userVal === 'not_sure') {
        scores.push(-1);
      } else {
        scores.push(userVal === q.correctAnswer ? 1 : 0);
      }
    });

    // Evaluate Q5 & Q6 (MCQ)
    this.mcqQuestions.forEach((q) => {
      const userVal = this.quizForm.value[q.id];
      if (userVal === 'not_sure') {
        scores.push(-1);
      } else {
        scores.push(userVal === q.correctAnswer ? 1 : 0);
      }
    });

    return scores;
  }

  onSubmit(): void {
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      return;
    }

    const uid = this.sessionService.getUid();
    if (!uid) {
      console.error('No active UID found in session.');
      return;
    }

    this.isSubmitting = true;

    const answerResults: number[] = this.evaluateAnswers();

    const payload: PosttestPayload = {
      uid: uid,
      answers: answerResults,
      language: this.selectedLanguage,
    };

    this.apiService.submitPosttest(payload).subscribe({
      next: async (response: any) => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        console.log('Posttest submitted successfully:', response);

        const toast = await this.toastController.create({
          message: 'Post-test recorded 🎉 One more questionnaire ahead!',
          duration: 2500,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();

        // Continue to the cognitive load questionnaire
        this.router.navigate(['/english-clt'], {
          queryParams: {
            uid: this.sessionService.getUid(),
            lang: this.selectedLanguage
          },
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Failed to submit posttest:', error);
      },
    });
  }
}
