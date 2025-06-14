import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { LoadingService } from '../../@services/loading.service';
import { ImportModule } from '../../@themes/import.theme';
import { BaseComponent } from '../../@core/base/base.component';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    ImportModule
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent extends BaseComponent implements OnInit {
  count = signal(0);

  ngOnInit(): void {
    this.rxSubscribe(this.loadingService.getObservable(), (count) => {
      this.count.set(count);
    })
  }
}
