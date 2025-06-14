import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { map } from "rxjs";
import { Brand } from "../@core/models/product.model";
import { Supplier } from "../@core/models/supplier.model";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly url = '/api/v1/brand';
  private readonly httpService = inject(HttpService);

  getAllSupplier() {
    return this.httpService.get('/open-api/products/brands').pipe(
      map(result => result.data)
    )
  }

  updateSuplier(data: Supplier, isEdit = false) {
    return (isEdit ? this.httpService.put(this.url, { data: data}) : this.httpService.post(this.url, { data: data})).pipe(
      map(res => res.data)
    )
  }

  deleteSupplier(id: number) {
    return this.httpService.delete(`${this.url}/${id}`);
  }

  getSupplierById(id: number) {
    return this.httpService.get(`${this.url}/${id}`).pipe(
      map(res => res.data)
    )
  }
}
