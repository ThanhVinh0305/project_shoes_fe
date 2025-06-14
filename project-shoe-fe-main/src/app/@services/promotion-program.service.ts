import { PromotionParamSearch } from './../@core/models/promotion-program.model';
import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { PromotionProgram } from "../@core/models/promotion-program.model";
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionProgramService {
  private readonly httpService = inject(HttpService);
  private readonly url = '';

  getPromotionProgram(params?: PromotionParamSearch) {
    const url = '/api/v1/promotions/get-promotion-by-filter';
    return this.httpService.post(url, { data: params }).pipe(
      map(res => res.data)
    );
  }

  deletePromotionProgram(id: number) {
    const url = `/api/v1/promotions/delete-promotion`;
    return this.httpService.delete(`${url}/${id}`);
  }

  getPromotionProgramById(id: number) {
    const url = `/api/v1/promotions/get-by-id/${id}`;
    return this.httpService.get(url).pipe(
      map(res => res.data)
    );
  }

  savePromotion(data: PromotionProgram) {
    const url = `/api/v1/promotions/save-promotion`;
    return this.httpService.post(url, { data: data });
  }
}
