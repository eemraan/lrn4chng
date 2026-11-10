import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SessionService } from '../core/session';

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  details: string[];
  reviewed: boolean;
}

@Component({
  selector: 'app-english-intro',
  templateUrl: './english-intro.page.html',
  styleUrls: ['./english-intro.page.scss'],
  standalone: false,
})
export class EnglishIntroPage implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sessionService = inject(SessionService);

  selectedLanguage: string = 'en';
  activeStageId: number | null = 1; // Stage 1 open by default

  stages: Stage[] = [
    {
      id: 1,
      title: 'Tell us about you 📝',
      subtitle: 'Check your baseline knowledge',
      icon: 'clipboard-outline',
      color: 'tertiary',
      description: 'Demographics information followed by a short, low-stakes quiz to see what you already know before starting the lesson.',
      details: [
        'Takes about 2–3 minutes'
      ],
      reviewed: true
    },
    {
      id: 2,
      title: 'Learning Experience 🚀',
      subtitle: 'Interactive learning',
      icon: 'sparkles-outline',
      color: 'primary',
      description: 'Engage with learning expereince.',
      details: [
        'Takes about 4–5 minutes'
      ],
      reviewed: false
    },
    {
      id: 3,
      title: 'Feedback Forms 💬',
      subtitle: 'Share your thoughts',
      icon: 'chatbubble-ellipses-outline',
      color: 'success',
      description: 'Tell us about your experience.',
      details: [
        'Takes upto 5 to 6 minutes'
      ],
      reviewed: false
    }
  ];

  private languageRoutes: { [key: string]: string } = {
    en: 'english',
    fr: 'french'
  };

  ngOnInit(): void {
    this.selectedLanguage =
      this.route.snapshot.queryParamMap.get('lang') ||
      localStorage.getItem('app_language') ||
      'en';
  }

  async toggleStage(stageId: number) {
    await Haptics.impact({ style: ImpactStyle.Light });

    // Toggle expansion
    this.activeStageId = this.activeStageId === stageId ? null : stageId;

    // Mark stage as reviewed
    const stage = this.stages.find(s => s.id === stageId);
    if (stage) {
      stage.reviewed = true;
    }
  }

  get reviewedCount(): number {
    return this.stages.filter(s => s.reviewed).length;
  }

  get allReviewed(): boolean {
    return this.reviewedCount === this.stages.length;
  }

  startExperience() {
    const routePrefix = this.languageRoutes[this.selectedLanguage] || this.selectedLanguage;

    // Route to the first stage (Knowledge Test / Demographics)
    this.router.navigate([`/${routePrefix}-demographics`], {
      queryParams: { lang: this.selectedLanguage }
    });
  }
}
