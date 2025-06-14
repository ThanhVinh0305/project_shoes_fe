import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { BehaviorSubject } from "rxjs";
import { BREADCRUMBS } from "../@core/constants/constant";

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly router = inject(Router);

  private items$ = new BehaviorSubject<MenuItem[]>([]);
  private readonly breadcrumbs = BREADCRUMBS;

  getAsObervable() {
    return this.items$.asObservable();
  }

  calculateBreadCrumb(url: string) {
    const urlArr = url.split('/');
    const items: MenuItem[] = [];
    urlArr.forEach((str, index) => {
      if (!str) {
        return;
      }
      const breadcrumb =  this.breadcrumbs.find(o => o.routerLink === str);
      if (!breadcrumb) {
        return;
      }
      if (!breadcrumb.label) {
        return;
      }
      items.push({
        ...breadcrumb,
        routerLink: index === (urlArr.length - 1) ? undefined : breadcrumb.routerLink
      });
    });
    this.items$.next(items);
  };
}
