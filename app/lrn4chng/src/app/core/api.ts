import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, firstValueFrom, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

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
  affiliation: string;
  genAiFamiliarity: number;
  nativeCountry: string;
  language: string;
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

export interface PosttestPayload {
  uid: string;
  answers: number[];
  language: string;
}

export interface PosttestResponse {
  status: string;
  message?: string;
  data?: PosttestPayload;
}

export interface CltPayload {
  uid: string;
  part: number;
  answers: number[];
  language: string;
}

export interface CltResponse {
  status: string;
  message?: string;
  data?: CltPayload;
}

export interface ImiPayload {
  uid: string;
  part: number;
  answers: number[];
  language: string;
}

export interface ImiResponse {
  status: string;
  message?: string;
  data?: ImiPayload;
}

export interface ThankPayload {
  uid: string;
  opinion: string;
  willing: boolean;
  language: string;
}

export interface ThankResponse {
  status: string;
  message?: string;
  data?: ThankPayload;
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
  round?: number;
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

  // ------------------------------------------------------------------
  // Request signing (M35): every call carries X-Api-Timestamp +
  // X-Api-Signature = hex HMAC-SHA256(secret, "<ts>\n<METHOD>\n<path>\n<sha256(body)>")
  // ------------------------------------------------------------------

  private async sha256Hex(data: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async signedHeaders(method: string, path: string, body?: unknown): Promise<Record<string, string>> {
    const ts = Math.floor(Date.now() / 1000).toString();
    // Multipart bodies (camera upload) are signed with an empty body hash —
    // the server applies the same rule for multipart content types.
    const bodyStr = body === undefined ? '' : (typeof body === 'string' ? body : JSON.stringify(body));
    const bodyHash = await this.sha256Hex(bodyStr);
    const canonical = `${ts}\n${method.toUpperCase()}\n${path}\n${bodyHash}`;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(environment.apiSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(canonical));
    const signature = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

    return { 'X-Api-Timestamp': ts, 'X-Api-Signature': signature };
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const headers = await this.signedHeaders('POST', path, body);
    return firstValueFrom(this.http.post<T>(`${this.baseUrl}${path}`, body, { headers }));
  }

  private async get<T>(path: string, params: Record<string, string>): Promise<T> {
    const headers = await this.signedHeaders('GET', path);
    return firstValueFrom(this.http.get<T>(`${this.baseUrl}${path}`, { params, headers }));
  }

  submitConsent(payload: ConsentPayload): Observable<ConsentResponse> {
    return from(this.post<ConsentResponse>('/consent', payload));
  }

  submitDemographics(payload: DemographicsPayload): Observable<DemographicsResponse> {
    return from(this.post<DemographicsResponse>('/demographics', payload));
  }

  submitPretest(payload: PretestPayload): Observable<PretestResponse> {
    return from(this.post<PretestResponse>('/pretest', payload));
  }

  submitPosttest(payload: PosttestPayload): Observable<PosttestResponse> {
    return from(this.post<PosttestResponse>('/posttest', payload));
  }

  submitClt(payload: CltPayload): Observable<CltResponse> {
    return from(this.post<CltResponse>('/clt', payload));
  }

  submitImi(payload: ImiPayload): Observable<ImiResponse> {
    return from(this.post<ImiResponse>('/imi', payload));
  }

  submitThank(payload: ThankPayload): Observable<ThankResponse> {
    return from(this.post<ThankResponse>('/thank', payload));
  }

  uploadCameraImage(file: Blob, uid: string, filename?: string): Observable<UploadPhotoResponse> {
    const formData = new FormData();
    formData.append('uid', uid);
    formData.append('file', file, filename || `photo_${Date.now()}.jpg`);

    // multipart: signed with empty body hash (server-side rule for multipart)
    return from((async () => {
      const headers = await this.signedHeaders('POST', '/camera/upload');
      return firstValueFrom(this.http.post<UploadPhotoResponse>(`${this.baseUrl}/camera/upload`, formData, { headers }));
    })());
  }

  getSection(sectionId: number, uid: string, language: string = 'en', round?: number): Observable<SectionFetchResponse> {
    const params: Record<string, string> = { sectionId: sectionId.toString(), uid: uid || '', language };
    if (round) {
      params['round'] = round.toString();
    }

    return from(this.get<SectionFetchResponse>('/quest/section', params)).pipe(
      tap(res => console.log(`[ApiService] Section ${sectionId} loaded:`, res)),
      catchError(err => {
        console.error(`[ApiService] Error fetching section ${sectionId}:`, err);
        return throwError(() => err);
      })
    );
  }

  getOptionFeedback(payload: FeedbackPayload): Observable<FeedbackResponse> {
    console.log(`[ApiService] POST payload -> /quest/feedback`, payload);

    return from(this.post<FeedbackResponse>('/quest/feedback', payload)).pipe(
      tap(res => console.log('[ApiService] Feedback received:', res)),
      catchError(err => {
        console.error('[ApiService] Error requesting feedback:', err);
        return throwError(() => err);
      })
    );
  }
}
