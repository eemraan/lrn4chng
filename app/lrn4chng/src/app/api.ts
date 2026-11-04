import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



export interface ConsentPayload {
  uid: string;
  accepted: boolean;
  email: string;
  language: string;
}

export interface ConsentResponse {
  status: string;
  message?: string;
  data?: ConsentPayload;
}

export interface DemographicsPayload {
  uid: string;
  age: number;
  gender: string;
  status: string;
  majorOrProfession: string;
  genAiFamiliarity: number;
  nativeCountry: string;
  language: string;
  isLeMansStudent: boolean;
}

export interface DemographicsResponse {
  status: string;
  message?: string;
  data?: DemographicsPayload;
}

export interface PretestPayload {
  uid: string;
  answers: number[];
  language: string;
}

export interface PretestResponse {
  status: string;
  message?: string;
  image_url?: string;
  data?: PretestPayload;
}

export interface UploadPhotoResponse {
  status: string;
  message?: string;
  filename?: string;
  data?: any;
}

export interface QuestSectionOption {
  text: string;
  isCorrect: boolean;
}

export interface QuestSectionTag {
  icon: string;
  label: string;
  cssClass?: string;
}

export interface QuestSection {
  id: number;
  type: 'binary' | 'single-select' | 'textarea';
  tag: QuestSectionTag;
  question: string;
  subtitle?: string;
  options?: QuestSectionOption[];
  binaryActions?: { value: 'yes' | 'no'; icon: string; text: string }[];
  feedback?: {
    correct: { header: string; message: string };
    incorrect: { header: string; message: string };
  };
  placeholder?: string;
  minWords?: number;
  continueText?: string;
  choicePromptText?: string;
  finishText?: string;
  letterBadges?: boolean;
}

export interface QuestData {
  questTitle: string;
  totalSteps: number;
  sections: QuestSection[];
}

export interface QuestResponse {
  status: string;
  message?: string;
  data?: QuestData;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  // Base API domain
  private readonly baseUrl = 'https://api.lrn4chng.site';

  // 1. Submit Consent Data
  submitConsent(payload: ConsentPayload): Observable<ConsentResponse> {
    return this.http.post<ConsentResponse>(`${this.baseUrl}/consent`, payload);
  }

  // 2. Submit Demographics Data
  submitDemographics(payload: DemographicsPayload): Observable<DemographicsResponse> {
    return this.http.post<DemographicsResponse>(`${this.baseUrl}/demographics`, payload);
  }

  // 3. Submit Pretest Answers Data
  submitPretest(payload: PretestPayload): Observable<PretestResponse> {
    return this.http.post<PretestResponse>(`${this.baseUrl}/pretest`, payload);
  }

  // 4. Upload Camera Image
  uploadCameraImage(file: Blob, uid: string, filename?: string): Observable<UploadPhotoResponse> {
    const formData = new FormData();
    formData.append('uid', uid);
    formData.append('file', file, filename || `photo_${Date.now()}.jpg`);
  
    return this.http.post<UploadPhotoResponse>(`${this.baseUrl}/camera/upload`, formData);
  }
  getQuest(language: string = 'en'): Observable<QuestResponse> {
    return this.http.get<QuestResponse>(`${this.baseUrl}/quest`, {
      params: { language }
    });
  }

}