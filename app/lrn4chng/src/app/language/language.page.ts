import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
  standalone: false
})
export class LanguagePage implements OnInit {
  currentLanguage: string = 'en';
  selected: boolean = false;

  translations: { [key: string]: { [key: string]: string } } = {
    en: {
      title: 'Choose Your Language 🌍',
      subtitle: 'We\'ll show everything in your preferred language',
      english: 'English 🇺🇸',
      french: 'Français 🇫🇷',
      englishNote: 'Click here',
      frenchNote: 'Cliquez ici',
      toastEnglish: 'Language updated to English 🇺🇸',
      toastFrench: 'Langue mise à jour vers le Français 🇫🇷',
      submit: 'Start Learning 🚀'
    },
    fr: {
      title: 'Choisissez votre langue 🌍',
      subtitle: 'Tout s\'affichera dans votre langue préférée',
      english: 'English 🇺🇸',
      french: 'Français 🇫🇷',
      englishNote: 'Click here',
      frenchNote: 'Cliquez ici',
      toastEnglish: 'Language updated to English 🇺🇸',
      toastFrench: 'Langue mise à jour vers le Français 🇫🇷',
      submit: 'Commencer l\'apprentissage 🚀'
    }
  };

  private languageRoutes: { [key: string]: string } = {
    en: 'english',
    fr: 'french'
  };

  private router = inject(Router);
  private toastController = inject(ToastController);

  ngOnInit() {
    const savedLang = localStorage.getItem('app_language');
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
      this.currentLanguage = savedLang;
    }
  }

  async selectLanguage(lang: string) {
    this.currentLanguage = lang;
    this.selected = true;
    localStorage.setItem('app_language', lang);

    await Haptics.impact({ style: ImpactStyle.Light });

    const toast = await this.toastController.create({
      message: lang === 'en' ? this.t('toastEnglish') : this.t('toastFrench'),
      duration: 3000,
      position: 'bottom',
      color: 'primary',
      cssClass: 'language-toast'
    });
    await toast.present();
  }

  submit() {
    const routePrefix = this.languageRoutes[this.currentLanguage] || 'english';

    // Route to the language consent page and pass the selected language state & query parameter
    this.router.navigate([`/${routePrefix}-consent`], {
      queryParams: { lang: this.currentLanguage },
      state: { language: this.currentLanguage }
    });
  }

  t(key: string): string {
    return this.translations[this.currentLanguage]?.[key] || this.translations['en'][key] || key;
  }
}