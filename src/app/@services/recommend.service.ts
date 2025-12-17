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
}

