import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private readonly httpService = inject(HttpService);

  getRecommendBlocks(): Observable<any> {
    return this.httpService.get('/open-api/recommend/blocks');
  }
}
