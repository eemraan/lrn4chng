import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import {
  NavController,
  IonContent
} from '@ionic/angular';
import { ApiService, QuestSection, QuestData } from '../api';

@Component({
  selector: 'app-english-learn',
  templateUrl: './english-learn.page.html',
  styleUrls: ['./english-learn.page.scss'],
  standalone: false,
})
export class EnglishLearnPage {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('section2Ref') section2Ref!: ElementRef<HTMLElement>;
  @ViewChild('section3Ref') section3Ref!: ElementRef<HTMLElement>;
  @ViewChild('section4Ref') section4Ref!: ElementRef<HTMLElement>;
  @ViewChild('section5Ref') section5Ref!: ElementRef<HTMLElement>;
  @ViewChild('section6Ref') section6Ref!: ElementRef<HTMLElement>;
  @ViewChild('section7Ref') section7Ref!: ElementRef<HTMLElement>;

  constructor(
    private navCtrl: NavController, 
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  // Header & Landing content
  questTitle: string = 'Ecology Quest';
  questDescription: string = 'Explore how trees adapt to cold weather and photosynthesis during winter.';
  totalSteps: number = 7;

  // Flow & State flags
  hasStarted: boolean = false;
  isLoadingQuest: boolean = false;
  questLoaded: boolean = false;
  questLoadError: string | null = null;

  // Default Sections (Fallback content)
  section1: QuestSection = {
    id: 1,
    type: 'binary',
    tag: { icon: 'eye-outline', label: 'Observation', cssClass: 'obs' },
    question: 'Do you see the trs in front of you?',
    subtitle: 'Take a moment to inspect the surrounding foliage before answering.',
    binaryActions: [
      { value: 'yes', icon: '🌲', text: 'Yes, I see them' },
      { value: 'no', icon: '🔍', text: 'No, let me look closer' }
    ],
    continueText: 'Continue to Question 2'
  };

  section2: QuestSection = {
    id: 2,
    type: 'single-select',
    tag: { icon: 'thermometer-outline', label: 'Conditions (14°C)', cssClass: 'alt' },
    question: 'In these cold conditions of 14°C and low humidity, what is happening to the trees?',
    options: [
      { text: 'Leaves break down chlorophyll and change color to conserve nutrients and prepare for winter dormancy.', isCorrect: true },
      { text: 'Leaves produce excess chlorophyll to absorb cold sunlight and accelerate growth.', isCorrect: false },
      { text: 'Trees absorb groundwater rapidly to pump warm sap and sprout new foliage.', isCorrect: false }
    ],
    feedback: {
      correct: { header: 'Great Insight!', message: 'Lower temperatures trigger trees to break down chlorophyll for dormancy.' },
      incorrect: { header: 'Try Again!', message: 'Re-read the options to find how cold weather affects leaf chlorophyll.' }
    },
    continueText: 'Continue to Question 3'
  };

  section3: QuestSection = {
    id: 3,
    type: 'single-select',
    tag: { icon: 'flash-outline', label: 'Plant Biology', cssClass: 'energy' },
    question: 'How do you think plants create energy?',
    letterBadges: true,
    options: [
      { text: 'Photosynthesis — converting light energy into chemical energy', isCorrect: true },
      { text: 'Soil Absorption — drawing energy directly from ground heat and minerals', isCorrect: false }
    ],
    feedback: {
      correct: { header: 'Spot On!', message: 'Plants use solar energy through photosynthesis to produce fuel.' },
      incorrect: { header: 'Try Again!', message: 'Plants rely on light rather than soil heat for energy synthesis.' }
    },
    continueText: 'Continue to Question 4'
  };

  section4: QuestSection = {
    id: 4,
    type: 'single-select',
    tag: { icon: 'flask-outline', label: 'Chemical Reaction', cssClass: 'chemical' },
    question: 'What exactly happens in photosynthesis?',
    options: [
      { text: 'Plants take in carbon dioxide and water, using light energy to produce glucose (sugar) and release oxygen as a byproduct.', isCorrect: true },
      { text: 'Plants absorb oxygen and glucose from the air, using soil heat to generate light energy and release water vapor.', isCorrect: false },
      { text: 'Plants draw nitrogen and minerals from the soil, using underground warmth to synthesize chlorophyll and release carbon dioxide.', isCorrect: false }
    ],
    feedback: {
      correct: { header: 'Correct!', message: 'CO₂ + Light + Water yields Glucose and Oxygen.' },
      incorrect: { header: 'Try Again!', message: 'Think about which inputs produce glucose and oxygen.' }
    },
    continueText: 'Continue to Question 5'
  };

  section5: QuestSection = {
    id: 5,
    type: 'textarea',
    tag: { icon: 'cloud-outline', label: 'Carbon Cycle', cssClass: 'climate' },
    question: 'When trees go dormant, how does it affect CO₂ emission?',
    subtitle: 'Explain your reasoning in the box below (at least 10 words).',
    placeholder: 'Type your explanation here...',
    minWords: 10,
    choicePromptText: 'Do you want to know what happens next or finish?'
  };

  section6: QuestSection = {
    id: 6,
    type: 'single-select',
    tag: { icon: 'leaf-outline', label: 'Atmospheric Oxygen', cssClass: 'oxygen' },
    question: 'What happens to Oxygen (O₂) output when trees are dormant in winter?',
    options: [
      { text: 'Oxygen production drops significantly because dormant trees stop photosynthesizing.', isCorrect: true },
      { text: 'Oxygen levels double as cold air compresses gas molecules around the tree canopy.', isCorrect: false },
      { text: 'Oxygen stays completely unchanged because leaves store extra oxygen reserves.', isCorrect: false }
    ],
    feedback: {
      correct: { header: 'Exactly Right!', message: 'Without leaves photosynthesizing, net oxygen release from deciduous forests decreases during winter months.' },
      incorrect: { header: 'Try Again!', message: 'Consider how photosynthesis generates O₂ and what happens when it shuts down.' }
    },
    choicePromptText: 'Do you want to know what happens next or finish?'
  };

  section7: QuestSection = {
    id: 7,
    type: 'binary',
    tag: { icon: 'earth-outline', label: 'Take Action', cssClass: 'final' },
    question: 'Do you think it is important to do our part to reduce CO₂ emissions in winter?',
    binaryActions: [
      { value: 'yes', icon: '🌍', text: 'Yes, absolutely' },
      { value: 'no', icon: '🤔', text: 'No, not necessary' }
    ],
    choicePromptText: 'Do you want to know what happens next or finish?',
    finishText: 'Finish & Complete Quest'
  };

  // User Selection Answers
  section1Answered: boolean = false;
  selectedSection2Option: number | null = null;
  selectedSection3Option: number | null = null;
  selectedSection4Option: number | null = null;
  section5Text: string = '';
  selectedSection6Option: number | null = null;
  section7Answer: 'yes' | 'no' | null = null;

  // 🚀 Triggered on "Let's Start" click
  startQuest(): void {
    this.hasStarted = true;
    this.loadQuestData();
  }

  loadQuestData(): void {
    if (this.isLoadingQuest) return;

    this.isLoadingQuest = true;
    this.questLoadError = null;
    this.cdr.detectChanges();

    console.log('🚀 Sending request to API...');

    this.api.getQuest().subscribe({
      next: (res: any) => {
        console.log('✅ RAW RESPONSE RECEIVED:', JSON.stringify(res, null, 2));
        this.isLoadingQuest = false;

        let sections: QuestSection[] = [];
        let parsedTitle = res?.title || res?.data?.questTitle || res?.questTitle;
        let parsedTotalSteps = res?.totalSteps || res?.data?.totalSteps;

        if (Array.isArray(res)) {
          sections = res;
        } else if (Array.isArray(res?.data)) {
          sections = res.data;
        } else if (Array.isArray(res?.data?.sections)) {
          sections = res.data.sections;
        } else if (Array.isArray(res?.sections)) {
          sections = res.sections;
        }

        if (sections.length > 0) {
          this.applyQuestData({
            questTitle: parsedTitle,
            totalSteps: parsedTotalSteps ?? sections.length,
            sections: sections
          });
        } else {
          console.warn('⚠️ No sections in response — using default sections.');
        }

        this.questLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ REQUEST FAILED:', err);
        this.isLoadingQuest = false;
        this.questLoadError = 'Could not load the quest. Please check your connection and try again.';
        this.cdr.detectChanges();
      }
    });
  }

  private applyQuestData(data: Partial<QuestData>): void {
    if (data.questTitle) this.questTitle = data.questTitle;
    if (data.totalSteps) this.totalSteps = data.totalSteps;

    const [s1, s2, s3, s4, s5, s6, s7] = data.sections ?? [];
    if (s1) this.section1 = s1;
    if (s2) this.section2 = s2;
    if (s3) this.section3 = s3;
    if (s4) this.section4 = s4;
    if (s5) this.section5 = s5;
    if (s6) this.section6 = s6;
    if (s7) this.section7 = s7;
  }

  // Answer methods
  answerSection1(answer: string): void { this.section1Answered = answer === 'yes'; }
  selectSection2Option(index: number): void { this.selectedSection2Option = index; }
  selectSection3Option(index: number): void { this.selectedSection3Option = index; }
  selectSection4Option(index: number): void { this.selectedSection4Option = index; }
  selectSection6Option(index: number): void { this.selectedSection6Option = index; }
  answerSection7(answer: 'yes' | 'no'): void { this.section7Answer = answer; }

  // Validation getters
  get isSection2Correct(): boolean {
    const opts = this.section2.options;
    return this.selectedSection2Option !== null && !!opts && opts[this.selectedSection2Option]?.isCorrect;
  }

  get isSection3Correct(): boolean {
    const opts = this.section3.options;
    return this.selectedSection3Option !== null && !!opts && opts[this.selectedSection3Option]?.isCorrect;
  }

  get isSection4Correct(): boolean {
    const opts = this.section4.options;
    return this.selectedSection4Option !== null && !!opts && opts[this.selectedSection4Option]?.isCorrect;
  }

  get section5WordCount(): number {
    return this.section5Text ? this.section5Text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  }

  get isSection5Valid(): boolean {
    return this.section5WordCount >= (this.section5.minWords || 10);
  }

  get isSection6Correct(): boolean {
    const opts = this.section6.options;
    return this.selectedSection6Option !== null && !!opts && opts[this.selectedSection6Option]?.isCorrect;
  }

  get isSection7Answered(): boolean {
    return this.section7Answer !== null;
  }

  // Navigation
  scrollToSection(target: ElementRef<HTMLElement> | HTMLElement): void {
    const element = target instanceof ElementRef ? target.nativeElement : target;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  finishQuest(): void {
    this.navCtrl.navigateForward('/summary');
  }

  get progressPercent(): number {
    if (this.isSection7Answered) return 100;
    if (this.isSection6Correct) return 85;
    if (this.isSection5Valid) return 70;
    if (this.isSection4Correct) return 55;
    if (this.isSection3Correct) return 40;
    if (this.isSection2Correct) return 25;
    if (this.section1Answered) return 10;
    return 0;
  }

  get currentStepNumber(): number {
    if (this.isSection6Correct) return 7;
    if (this.isSection5Valid) return 6;
    if (this.isSection4Correct) return 5;
    if (this.isSection3Correct) return 4;
    if (this.isSection2Correct) return 3;
    if (this.section1Answered) return 2;
    return 1;
  }

  getOptionBadge(section: QuestSection, index: number): string {
    return section.letterBadges ? String.fromCharCode(65 + index) : (index + 1).toString();
  }
}