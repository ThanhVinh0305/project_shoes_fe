import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ParamSearch, Product } from '../@core/models/product.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly httpService = inject(HttpService);

  updateProduct(data: Product) {
    return this.httpService.post('/api/v1/product/save', { data: data }).pipe(map(res => res.data));
  }

  getProductById(id: number) {
    const url = `/open-api/products/${id}`;
    return this.httpService.get(url).pipe(
      map(res => res.data)
    )
  }

  deleteProduct(id: number) {
    const url = `/api/v1/product/${id}`;
    return this.httpService.delete(url);
  }

  getProducts(paramSearch?: ParamSearch) {
    const url = '/open-api/products/search-products';
    let search: ParamSearch = {
      page: 0,
      size: 3000000
    }
    if (paramSearch) {
      search = Object.assign(search, paramSearch);
    }
    return this.httpService.post(url, { data: paramSearch || {} }).pipe(
      map(res => res.data)
    )
  }
}
