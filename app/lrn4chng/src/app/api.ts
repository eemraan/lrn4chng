import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

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
  placeholder?: string;
  minWords?: number;
  continueText?: string;
  choicePromptText?: string;
  finishText?: string;
  letterBadges?: boolean;
}

export interface SectionFetchResponse {
  status: string;
  questTitle: string;
  totalSteps: number;
  section: QuestSection;
}

export interface FeedbackPayload {
  uid: string;
  sectionId: number;
  timestamp: number;
  clicksCount: number;
  selectedOption?: number | string | null;
  textInput?: string | null;
  allResponses?: Record<string, any>;
  language?: string;
}

export interface FeedbackResponse {
  status: string;
  isCorrect: boolean;
  header: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://api.lrn4chng.site';

  submitConsent(payload: ConsentPayload): Observable<ConsentResponse> {
    return this.http.post<ConsentResponse>(`${this.baseUrl}/consent`, payload);
  }

  submitDemographics(payload: DemographicsPayload): Observable<DemographicsResponse> {
    return this.http.post<DemographicsResponse>(`${this.baseUrl}/demographics`, payload);
  }

  submitPretest(payload: PretestPayload): Observable<PretestResponse> {
    return this.http.post<PretestResponse>(`${this.baseUrl}/pretest`, payload);
  }

  uploadCameraImage(file: Blob, uid: string, filename?: string): Observable<UploadPhotoResponse> {
    const formData = new FormData();
    formData.append('uid', uid);
    formData.append('file', file, filename || `photo_${Date.now()}.jpg`);
  
    return this.http.post<UploadPhotoResponse>(`${this.baseUrl}/camera/upload`, formData);
  }

  getSection(sectionId: number, uid: string, language: string = 'en'): Observable<SectionFetchResponse> {
    const url = `${this.baseUrl}/quest/section`;
    const params = { sectionId: sectionId.toString(), uid: uid || '', language };

    return this.http.get<SectionFetchResponse>(url, { params }).pipe(
      tap(res => console.log(`[ApiService] Section ${sectionId} loaded:`, res)),
      catchError(err => {
        console.error(`[ApiService] Error fetching section ${sectionId}:`, err);
        return throwError(() => err);
      })
    );
  }

  getOptionFeedback(payload: FeedbackPayload): Observable<FeedbackResponse> {
    const url = `${this.baseUrl}/quest/feedback`;

    console.log(`[ApiService] POST payload -> ${url}`, payload);

    return this.http.post<FeedbackResponse>(url, payload).pipe(
      tap(res => console.log('[ApiService] Feedback received:', res)),
      catchError(err => {
        console.error('[ApiService] Error requesting feedback:', err);
        return throwError(() => err);
      })
    );
  }
}