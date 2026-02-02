import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map } from 'rxjs';
import { RecommendBlock } from '../@core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendService {
  private readonly httpService = inject(HttpService);

  getBlocks(params?: { userId?: number }) {
    return this.httpService.get('/open-api/recommend/blocks', { params })
      .pipe(map(res => res?.data || res || {}));
  }

  getPersonalizedRecommendations() {
    return this.httpService.get('/api/v1/recommendations/personalized')
      .pipe(map(res => res)); // API returns List<ProductResponse> directly or wrapped? Backend Controller returns ResponseEntity.ok(List...) -> JSON Array.
      // Need to check HttpService if it unwraps .data or not. Default assumes .data usually.
      // Backend: return ResponseEntity.ok(list); -> Body is the list.
      // HttpService likely returns the raw body or checks for .data.
      // Let's check HttpService to be safe.
  }
}

