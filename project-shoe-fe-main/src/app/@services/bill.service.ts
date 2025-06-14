import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BasePage, CreateBillBody, CreateBillNowBody } from '../@core/models/bill.model';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BillService {
  private readonly httpService = inject(HttpService);
  private readonly urlBase = '/api/v1/bill';

  createBill(data: CreateBillBody) {
    const url = this.urlBase + '/create-bill';
    return this.httpService.post(url, { data: data }).pipe(
      map(res => res.data)
    );
  }

  buyNow(data: CreateBillNowBody) {
    const url = this.urlBase + '/buy-now';
    return this.httpService.post(url, { data: data }).pipe(
      map(res => res.data)
    )
  }

  getBills(params: BasePage) {
    const url = this.urlBase +  '/get-all';
    return this.httpService.post(url, { data: params }).pipe(
      map(res => res.data)
    )
  }

  getBillById(id: number) {
    const url = this.urlBase + `/get-bill-info/${id}`;
    return this.httpService.post(url).pipe(
      map(res => res.data)
    )
  }

  cancelBill(id: number) {
    const url = this.urlBase + `/cancel-order/${id}`;
    return this.httpService.post(url);
  }

  confirmBill(id: number) {
    const url = this.urlBase + `/confirm-purchase/${id}`;
    return this.httpService.put(url);
  }
}
