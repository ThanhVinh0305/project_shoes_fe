import { Component, inject, OnInit, signal } from '@angular/core';
import { Bill } from '../../@core/models/bill.model';
import { ImportModule } from '../../@themes/import.theme';
import { noImage } from '../../@core/constants/constant';
import { BaseComponent } from '../../@core/base/base.component';
import { map, switchMap } from 'rxjs';
import { BillService } from '../../@services/bill.service';

@Component({
  selector: 'app-bill-detail',
  standalone: true,
  imports: [
    ImportModule
  ],
  templateUrl: './bill-detail.component.html',
  styleUrl: './bill-detail.component.scss'
})
export class BillDetailComponent extends BaseComponent implements OnInit {
  private readonly billService = inject(BillService);
  bill = signal<Bill>({});
  noImage = noImage;
  id!: number;

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => params['id']),
      switchMap(id => {
        this.id = id;
        return this.billService.getBillById(id)
      })
    ), (bill: Bill) => {
      this.bill.set(bill);
    })
  }

  goBillManagement() {
    this.router.navigate(['/admin/bill-management']);
  }

  onCancelBill() {
    this.rxSubscribe(this.confirmDialog.showDialog({
      confirmText: 'Bạn có muốn hủy đơn hàng này không?'
    }), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.billService.cancelBill(this.id), () => {
          this.messageService.showMessage({
            detail: 'Hủy đơn hàng thành công.'
          });
          this.router.navigate(['/admin/bill-management']);
        })
      }
    })
  }

  confirmBill() {
    this.rxSubscribe(this.confirmDialog.showDialog(), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.billService.confirmBill(this.id), () => {
          this.messageService.showMessage({
            detail: 'Xác nhận đơn hàng thành công.'
          });
          this.router.navigate(['/admin/bill-management']);
        })
      }
    })
  }
}
