import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private readonly httpService = inject(HttpService);
  private readonly authenticationService = inject(AuthenticationService);

  getUserId(): number | undefined {
    return this.authenticationService.currentUser?.id;
  }

  trackClick(productId: number) {
    const userId = this.getUserId();
    if (!userId) return;
    return this.httpService.post('/user-behaviors/click', {
      data: { userId, productId }
    }).subscribe({ next: () => {}, error: () => {} });
  }

  trackView(productId: number) {
    const userId = this.getUserId();
    if (!userId) return;
    return this.httpService.post('/user-behaviors/view', {
      data: { userId, productId }
    }).subscribe({ next: () => {}, error: () => {} });
  }


  trackSearch(keyword: string) {
    const userId = this.getUserId();
    if (!userId) return;
    return this.httpService.post('/user-behaviors/search', {
      data: { userId, keyword }
    }).subscribe({ next: () => {}, error: () => {} });
  }

  trackAddToCart(productId: number) {
    const userId = this.getUserId();
    if (!userId) return;
    return this.httpService.post('/user-behaviors/add-to-cart', {
      data: { userId, productId }
    }).subscribe({ next: () => {}, error: () => {} });
  }
}
