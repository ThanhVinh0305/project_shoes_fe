import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { BehaviorSubject, map } from "rxjs";
import { Category } from "../@core/models/product.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly url = '/api/v1/category';
  private readonly httpService = inject(HttpService);

  private readonly categories$ = new BehaviorSubject<Category[]>([]);

  getCategoriesObservable() {
    return this.categories$.asObservable();
  }

  updateCategories(categories: Category[]) {
    this.categories$.next(categories);
  }

  getAllCategory() {
    return this.httpService.get('/open-api/products/categories').pipe(
      map(result => result.data)
    )
  }

  updateCategory(data: Category, isEdit = false) {
    return (isEdit ? this.httpService.put(this.url, { data: data}) : this.httpService.post(this.url, { data: data})).pipe(
      map(res => res.data)
    )
  }

  deleteCategory(id: number) {
    return this.httpService.delete(`${this.url}/${id}`);
  }

  getCategoryById(id: number) {
    return this.httpService.get(`${this.url}/${id}`).pipe(
      map(res => res.data)
    )
  }
}
