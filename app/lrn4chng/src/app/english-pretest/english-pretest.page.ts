import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SessionService } from '../core/session';
import { ApiService, PretestPayload } from '../core/api';

interface QuestionConfig {
  id: string;
  question: string;
  correctAnswer: boolean | string;
}

interface McqQuestionConfig extends QuestionConfig {
  options: { label: string; value: string; text: string }[];
}

@Component({
  selector: 'app-english-pretest',
  templateUrl: './english-pretest.page.html',
  styleUrls: ['./english-pretest.page.scss'],
  standalone: false,
})
export class EnglishPretestPage implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private sessionService = inject(SessionService);

  quizForm!: FormGroup;
  isSubmitting: boolean = false;
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
    {
      id: 'q7',
      question: 'Compared with summer, what typically happens to CO₂ emissions in cities during winter?',
      correctAnswer: 'increase',
      options: [
        { label: 'A', value: 'decrease', text: 'They decrease.' },
        { label: 'B', value: 'same', text: 'They remain approximately the same.' },
        { label: 'C', value: 'increase', text: 'They increase.' },
        { label: 'D', value: 'not_sure', text: 'Not Sure' },
      ],
    },
    {
      id: 'q8',
      question: 'Why do you think this happens?',
      correctAnswer: 'heating_photo',
      options: [
        { label: 'A', value: 'less_travel', text: 'People use less electricity and travel less during winter, but the increased concentration of CO₂ in colder air causes overall urban emissions to rise.' },
        { label: 'B', value: 'heating_photo', text: 'People use more heating during winter, increasing fuel consumption and CO₂ emissions. At the same time, trees absorb less CO₂ because of reduced photosynthesis.' },
        { label: 'C', value: 'colder_absorb', text: 'People use more heating during winter, but colder temperatures also allow trees to absorb more CO₂, balancing out the additional emissions.' },
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

    const payload: PretestPayload = {
      uid: uid,
      answers: answerResults,
      language: this.selectedLanguage,
    };

    this.apiService.submitPretest(payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        console.log('Pretest submitted successfully:', response);

        const routePrefix = this.languageRoutes[this.selectedLanguage] || this.selectedLanguage;
        const imageUrl = response.image_url;

        this.router.navigate([`/${routePrefix}-camera`], {
          queryParams: { 
            lang: this.selectedLanguage,
            imageUrl: imageUrl 
          },
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Failed to submit pretest:', error);
      },
    });
  }
}