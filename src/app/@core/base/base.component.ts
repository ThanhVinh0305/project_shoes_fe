import {Component, inject, Injectable, OnDestroy, signal} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {AuthenticationService} from "../../@services/authentication.service";
import { LoadingService } from "../../@services/loading.service";
import { MessagesService } from "../../@services/message.service";
import { ConfirmDeleteDialogService } from "../../@services/confirm-delete.service";
import { BreadcrumbService } from "../../@services/breadcrumb.service";
import { ConfirmDialogService } from "../../@services/confirm-dialog.service";
import { CartService } from "../../@services/cart.service";
import { Category } from "../models/product.model";
import { CategoryService } from "../../@services/category.service";
import { User } from "../models/auth.model";

@Injectable({
  providedIn: 'root'
})
@Component({
  template: '',
  standalone: true
})
export class BaseComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  protected fb = inject(FormBuilder);
  protected activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);
  protected authenticationService = inject(AuthenticationService);
  protected loadingService = inject(LoadingService);
  protected messageService = inject(MessagesService);
  protected confirmDelete = inject(ConfirmDeleteDialogService);
  protected breadcrumbService = inject(BreadcrumbService);
  protected confirmDialog = inject(ConfirmDialogService);
  protected cartService = inject(CartService);

  currentUrl: string | undefined = undefined;
  currentUserBase: User | undefined = undefined;
  constructor() {
    this.rxSubscribe(this.authenticationService.getCurrentUserObservable(), (currentUser) => {
      this.currentUserBase = currentUser;
    })
  }

  rxSubscribe<T>(observable: Observable<T>, next: (value: T) => void, error?: (err: any) => void, complete?: () => void) {
    const subscription = observable.subscribe({
      next,
      error,
      complete
    });
    this.subscriptions.push(subscription);
    return subscription;
  }

  rxUnSubscribe(subscription: Subscription) {
    this.subscriptions = this.subscriptions.filter((s: Subscription) => s !== subscription);
    subscription.unsubscribe();
  }

  rxUnSubscribeAll() {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
    this.subscriptions = [];
  }

  ngOnDestroy(): void {
    this.rxUnSubscribeAll();
  }
}
