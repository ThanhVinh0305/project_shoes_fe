import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly httpService = inject(HttpService);
  private readonly apiUrl = 'http://171.244.130.36:8000/ask';

  askQuestion(question: string, sessionId: string): Observable<any> {
    const payload = {
      question: question,
      session_id: sessionId
    };

    return this.httpService.post(this.apiUrl, {
      data: payload,
      ignoreBaseUrl: true,
      ignoreAuthToken: true,
      hideLoading: true
    });
  }
}
