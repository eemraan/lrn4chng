import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-decide',
  templateUrl: './decide.page.html',
  styleUrls: ['./decide.page.scss'],
  standalone: false,
})
export class DecidePage implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);

  uid: string = '';
  selectedLanguage: string = 'en';
  round: number = 1;

  /** How many learning experiences exist (english-learn, english-learn-2).
   *  Bump to 3 when english-learn-3 is added. */
  readonly TOTAL_LEARNING_EXPERIENCES = 2;

  ngOnInit(): void {
    this.readRouteParams();
  }

  /** Fires on EVERY page entry (including reused Ionic view instances),
   *  so the round is refreshed when returning to decide after round 2. */
  ionViewWillEnter(): void {
    this.readRouteParams();
  }

  private readRouteParams(): void {
    this.uid = this.route.snapshot.queryParamMap.get('uid') || '';

    this.selectedLanguage =
      this.route.snapshot.queryParamMap.get('lang') ||
      localStorage.getItem('app_language') ||
      'en';

    this.round = Number(this.route.snapshot.queryParamMap.get('round')) || 1;
  }

  /** Another quest is available only while the user hasn't completed them all. */
  get hasNextExperience(): boolean {
    return this.round < this.TOTAL_LEARNING_EXPERIENCES;
  }

  async learnSomethingElse(): Promise<void> {
    if (!this.hasNextExperience) {
      return;
    }

    await Haptics.impact({ style: ImpactStyle.Light });

    this.router.navigate([`/english-learn-${this.round + 1}`], {
      queryParams: { uid: this.uid, lang: this.selectedLanguage }
    });
  }

  async moveToFeedback(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Light });

    // Feedback form comes after the post-test
    this.router.navigate(['/post-test'], {
      queryParams: { uid: this.uid, lang: this.selectedLanguage }
    });
  }
}
