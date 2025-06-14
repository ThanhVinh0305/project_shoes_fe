import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { ImportCoupon, ParamsPage } from "../@core/models/import-coupon.model";
import { map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImportCouponService {
  private readonly httpService = inject(HttpService);
  private readonly urlBase = '/api/v1/import';

  confirm(ticket_id: number) {
    const url =  this.urlBase + '/confirm';
    return this.httpService.put(url, { data: { ticket_id }});
  }

  deleteImportCoupon(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.httpService.delete(url);
  }

  updateImportCoupon(data: ImportCoupon) {
    const url = this.urlBase + '/save-or-update-ticket';
    return this.httpService.post(url, { data: data });
  }

  getImportCoupon(params: ParamsPage) {
    const url = this.urlBase + '/get-all';
    return this.httpService.post(url, { data: params }).pipe(
      map(res => res.data)
    )
  }

  getImportCouponById(id: number) {
    const url = this.urlBase + `/get-by-id/${id}`;
    return this.httpService.get(url).pipe(
      map(res => res.data)
    );
  }
}
