import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly httpService = inject(HttpService);
  private readonly urlBase = '/api/v1/statistic';

  totalProduct() {
    const url = this.urlBase + '/total-product-in-store';
    return this.httpService.get(url).pipe(
      map(res => res.data)
    );
  }

  revenue() {
    const url = this.urlBase + '/revenue-statistic';
    return this.httpService.get(url).pipe(
      map(res => res.data)
    );
  }

  orderStatus() {
    const url = this.urlBase + '/order-status-statistic';
    return this.httpService.get(url).pipe(
      map(res => res.data)
    );
  }

  importProductStatistic() {
    const url = this.urlBase + '/import-product-statistic';
    return this.httpService.get(url).pipe(
      map(res => res.data)
    );
  }
}
