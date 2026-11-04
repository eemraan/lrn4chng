import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'language',
    pathMatch: 'full'
  },
  {
    path: 'sensor',
    loadChildren: () => import('./sensor/sensor.module').then( m => m.SensorPageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'english',
    loadChildren: () => import('./english/english.module').then( m => m.EnglishPageModule)
  },
  {
    path: 'french',
    loadChildren: () => import('./french/french.module').then( m => m.FrenchPageModule)
  },
  {
    path: 'english-email',
    loadChildren: () => import('./english-email/english-email.module').then( m => m.EnglishEmailPageModule)
  },
  {
    path: 'french-email',
    loadChildren: () => import('./french-email/french-email.module').then( m => m.FrenchEmailPageModule)
  },
  {
    path: 'french-consent',
    loadChildren: () => import('./french-consent/french-consent.module').then( m => m.FrenchConsentPageModule)
  },
  {
    path: 'english-consent',
    loadChildren: () => import('./english-consent/english-consent.module').then( m => m.EnglishConsentPageModule)
  },
  {
    path: 'english-demographics',
    loadChildren: () => import('./english-demographics/english-demographics.module').then( m => m.EnglishDemographicsPageModule)
  },
  {
    path: 'french-demographics',
    loadChildren: () => import('./french-demographics/french-demographics.module').then( m => m.FrenchDemographicsPageModule)
  },
  {
    path: 'english-intro',
    loadChildren: () => import('./english-intro/english-intro.module').then( m => m.EnglishIntroPageModule)
  },
  {
    path: 'french-intro',
    loadChildren: () => import('./french-intro/french-intro.module').then( m => m.FrenchIntroPageModule)
  },
  {
    path: 'english-pretest',
    loadChildren: () => import('./english-pretest/english-pretest.module').then( m => m.EnglishPretestPageModule)
  },
  {
    path: 'english-camera',
    loadChildren: () => import('./english-camera/english-camera.module').then( m => m.EnglishCameraPageModule)
  },
  {
    path: 'english-learn',
    loadChildren: () => import('./english-learn/english-learn.module').then( m => m.EnglishLearnPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
