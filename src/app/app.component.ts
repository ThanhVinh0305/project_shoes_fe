import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { LoadingComponent } from "./@components/loading/loading.component";
import { BaseComponent } from './@core/base/base.component';
import { ImportModule } from './@themes/import.theme';
import { ConfirmDeleteDialogComponent } from "./@components/confirm-dialog/confirm-delete.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, LoadingComponent, ImportModule, ConfirmDeleteDialogComponent]
})
export class AppComponent extends BaseComponent implements OnInit {
  primeNgConfig = inject(PrimeNGConfig);
  title = 'project-shoe';

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;
    this.breadcrumbService.calculateBreadCrumb(this.removeQueryParam(this.router.url));
    this.rxSubscribe(this.router.events, (e) => {
      if (e instanceof NavigationEnd) {
        this.breadcrumbService.calculateBreadCrumb(this.removeQueryParam(this.router.url));
      }
    });
    const time = this.authenticationService.calculateExpiresIn();
    if (time > 5) {
      this.authenticationService.getUserInfo();
      return;
    }
    this.router.navigate(['/'])
  }

  removeQueryParam(url: string) {
    if (!url.includes('?')) {
      return url;
    }
    const arrUrl = url.split('?');
    console.log(arrUrl);
    arrUrl.pop();
    return arrUrl.join('/');
  }
}
