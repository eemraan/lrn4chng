import {
  Component,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  ChangeDetectorRef,
  OnInit,
  NgZone,
  HostListener
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent } from '@ionic/angular';
import { ApiService, QuestSection, FeedbackResponse, FeedbackPayload } from '../core/api';

export interface LoadedSectionState {
  section: QuestSection;
  selectedOption: number | string | null;
  feedbackLoading: boolean;
  feedback: FeedbackResponse | null;
  textValue?: string;
  isCompleted: boolean;
  clicksCount: number;
}

@Component({
  selector: 'app-english-learn',
  templateUrl: './english-learn.page.html',
  styleUrls: ['./english-learn.page.scss'],
  standalone: false,
})
export class EnglishLearnPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  // Component-scoped section elements — immune to ion-router-outlet keeping
  // previously visited pages (with duplicate section-card ids) in the DOM.
  @ViewChildren('sectionEl') sectionEls!: QueryList<ElementRef<HTMLElement>>;

  uid: string = '';
  selectedLanguage: string = 'en';
  round: number = 1;

  questTitle: string = 'Ecology Quest';
  questDescription: string = 'Explore how trees adapt to cold weather and photosynthesis during winter.';
  totalSteps: number = 8;

  hasStarted: boolean = false;
  isLoadingSection: boolean = false;
  questLoadError: string | null = null;

  loadedSections: LoadedSectionState[] = [];
  
  // Requirement 2 & 4: Track total clicks/touches and accumulated user responses
  totalClicksCount: number = 0;
  allUserResponses: Record<string, any> = {};

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  @HostListener('document:click')
  @HostListener('document:touchstart')
  onUserInteraction(): void {
    this.totalClicksCount++;
    if (this.loadedSections.length > 0) {
      const current = this.loadedSections[this.loadedSections.length - 1];
      if (current) {
        current.clicksCount++;
      }
    }
  }

  ngOnInit(): void {
    console.log('[EnglishLearnPage] Initializing component...');
    
    const queryUid = this.route.snapshot.queryParamMap.get('uid') || this.route.snapshot.queryParams['uid'];
    const queryLang = this.route.snapshot.queryParamMap.get('lang') || this.route.snapshot.queryParams['lang'];

    if (queryUid) {
      this.uid = queryUid;
      console.log('[EnglishLearnPage] UID loaded successfully:', this.uid);
    } else {
      console.warn('[EnglishLearnPage] WARNING: UID parameter missing from route query params!');
    }

    if (queryLang) {
      this.selectedLanguage = queryLang;
    }

    // Round (study content set) comes from the route data (e.g. /english-learn-2
    // carries {round: 2}), falling back to a ?round= query param, defaulting to 1
    const routeRound = this.route.snapshot.data['round'];
    const queryRound = this.route.snapshot.queryParamMap.get('round');
    this.round = Number(routeRound ?? queryRound ?? 1) || 1;
    console.log('[EnglishLearnPage] Round:', this.round);
  }

  startQuest(): void {
    console.log('[EnglishLearnPage] Starting Quest -> Requesting Section 1 from API');
    this.hasStarted = true;
    this.fetchNextSection(1);
  }

  fetchNextSection(sectionId: number): void {
    if (this.isLoadingSection) return;

    this.isLoadingSection = true;
    this.questLoadError = null;
    this.cdr.detectChanges();

    this.api.getSection(sectionId, this.uid, this.selectedLanguage, this.round).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.isLoadingSection = false;

          if (res?.section) {
            this.questTitle = res.questTitle || this.questTitle;
            this.totalSteps = res.totalSteps || this.totalSteps;

            const newSectionState: LoadedSectionState = {
              section: res.section,
              selectedOption: null,
              feedbackLoading: false,
              feedback: null,
              textValue: '',
              isCompleted: false,
              clicksCount: 0
            };

            this.loadedSections.push(newSectionState);
            this.cdr.detectChanges();
            this.scrollToSectionElement(res.section.id);
          } else {
            this.questLoadError = 'Invalid section data received from server.';
          }
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.isLoadingSection = false;
          this.questLoadError = `Failed to load section ${sectionId}. Please check server connection.`;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onOptionSelected(sectionIndex: number, optionValue: number | string): void {
    const state = this.loadedSections[sectionIndex];
    if (!state) return;

    state.selectedOption = optionValue;
    this.allUserResponses[state.section.id.toString()] = optionValue;

    // Requirement 3: For section 7 or single select, request feedback from API server
    if (state.section.type === 'single-select' || state.section.id === this.totalSteps) {
      this.fetchFeedbackForState(state);
    } else {
      state.isCompleted = true;
      this.cdr.detectChanges();
    }
  }

  private fetchFeedbackForState(state: LoadedSectionState): void {
    state.feedbackLoading = true;
    state.feedback = null;
    this.cdr.detectChanges();

    // Requirement 2, 4: Include Linux timestamp, UID, clicks count, and all open/selected responses
    const payload: FeedbackPayload = {
      uid: this.uid,
      sectionId: state.section.id,
      timestamp: Math.floor(Date.now() / 1000), // Linux Timestamp in seconds
      clicksCount: state.clicksCount,
      selectedOption: state.selectedOption,
      textInput: state.textValue || null,
      allResponses: this.allUserResponses,
      language: this.selectedLanguage,
      round: this.round
    };

    this.api.getOptionFeedback(payload).subscribe({
      next: (res) => {
        this.zone.run(() => {
          state.feedbackLoading = false;
          state.feedback = res;
          state.isCompleted = true;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          state.feedbackLoading = false;
          state.feedback = {
            status: 'error',
            isCorrect: false,
            header: 'Feedback Status',
            message: 'Feedback received and response recorded.'
          };
          state.isCompleted = true;
          this.cdr.detectChanges();
        });
      }
    });
  }

  /**
   * Wrong answer on a single-select: clear the feedback so the options
   * reappear in place and the user can pick the correct one.
   */
  retrySection(state: LoadedSectionState): void {
    state.feedback = null;
    state.feedbackLoading = false;
    state.selectedOption = null; // clear stale highlight
    this.cdr.detectChanges();
  }

  onContinueSection(sectionIndex: number): void {
    const state = this.loadedSections[sectionIndex];
    if (!state) return;

    // Requirement 2: Send Linux timestamp, UID, and touches/clicks on continue click
    const timestamp = Math.floor(Date.now() / 1000);
    const payload: FeedbackPayload = {
      uid: this.uid,
      sectionId: state.section.id,
      timestamp: timestamp,
      clicksCount: state.clicksCount,
      selectedOption: state.selectedOption,
      textInput: state.textValue || null,
      allResponses: this.allUserResponses,
      language: this.selectedLanguage,
      round: this.round
    };

    this.api.getOptionFeedback(payload).subscribe({
      next: () => console.log(`[EnglishLearnPage] Continue tracking logged for Section ${state.section.id}`),
      error: (err) => console.error('[EnglishLearnPage] Tracking error on continue:', err)
    });

    const nextSectionId = Number(state.section.id) + 1;
    if (!Number.isFinite(nextSectionId) || nextSectionId < 1) {
      console.error('[EnglishLearnPage] Invalid section id, cannot continue:', state.section.id);
      return;
    }
    this.fetchNextSection(nextSectionId);
  }

  onTextareaChange(state: LoadedSectionState): void {
    const words = state.textValue ? state.textValue.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
    const minWords = state.section.minWords || 10;
    state.isCompleted = words >= minWords;
    if (state.isCompleted && state.textValue) {
      this.allUserResponses[state.section.id.toString()] = state.textValue;
    }
  }

  getWordCount(text?: string): number {
    return text ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  }

  finishQuest(): void {
    console.log('[EnglishLearnPage] Quest finished (round', this.round + ') — navigating to decide page');
    this.navCtrl.navigateForward('/decide', {
      queryParams: { uid: this.uid, lang: this.selectedLanguage, round: this.round }
    });
  }

  private scrollToSectionElement(sectionId: number): void {
    setTimeout(() => {
      // Look up the section within THIS component's view only — the document-wide
      // getElementById could match a previous page's element kept in the DOM by
      // ion-router-outlet (e.g. the round-1 page when running round 2).
      const target = this.sectionEls?.find(
        el => el.nativeElement.id === `section-card-${sectionId}`
      );
      if (target) {
        target.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        this.content?.scrollToBottom(500);
      }
    }, 150);
  }

  get currentStepNumber(): number {
    return this.loadedSections.length;
  }

  get progressPercent(): number {
    if (this.totalSteps === 0) return 0;
    return Math.round((this.loadedSections.filter(s => s.isCompleted).length / this.totalSteps) * 100);
  }

  getOptionBadge(section: QuestSection, index: number): string {
    return section.letterBadges ? String.fromCharCode(65 + index) : (index + 1).toString();
  }

  /**
   * Whether the learner may proceed past this section.
   * §5 (Tier 1) passes regardless of correctness (M8); other single-select
   * sections only proceed on a correct answer; binary/textarea always pass.
   */
  canProceed(state: LoadedSectionState): boolean {
    if (state.section.type === 'single-select' && state.section.id !== 5) {
      return state.feedback?.isCorrect === true;
    }
    return state.isCompleted;
  }
}