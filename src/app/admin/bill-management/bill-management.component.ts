import { Component, inject, OnInit, signal } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { Bill } from '../../@core/models/bill.model';
import { TablePageEvent } from 'primeng/table';
import { BasePageResponse, ParamSearch } from '../../@core/models/product.model';
import { ImportModule } from '../../@themes/import.theme';
import { BaseComponent } from '../../@core/base/base.component';
import { BillService } from '../../@services/bill.service';
import { JsonPipe } from '@angular/common';
import { STATUS_BILL } from '../../@core/constants/constant';

@Component({
  selector: 'app-bill-management',
  standalone: true,
  templateUrl: './bill-management.component.html',
  styleUrl: './bill-management.component.scss',
  imports: [
    ImportModule,
  ],
})
export class BillManagementComponent extends BaseComponent implements OnInit {
  private readonly billService = inject(BillService);
  bills = signal<Bill[]>([]);
  first = signal(0);
  rows = signal(10);
  rowsPerPageOptions = [10, 15, 20, 30];
  totalRecords = signal(0);
  params: ParamSearch = {
    page: this.first() + 1,
    size: this.rows()
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.rxSubscribe(this.billService.getBills(this.params), (result: BasePageResponse<Bill>) => {
      this.bills.set(result.data?.map(o => {
        const status = STATUS_BILL.find(z => z.value === o.status);
        o.statusText = status?.label;
        return o;
      }) || []);
      this.totalRecords.set(result.total || 0);
    })
  }

  pageChange(event: TablePageEvent) {
    this.first.set(event.first);
    this.rows.set(event.rows);
    this.params.page = Math.floor(this.first() / this.rows()) + 1
    this.params.size = this.rows();
    this.initData();
  }

  onEdit(id: number) {
    this.router.navigate(['/admin/bill-management/bill-detail'], { queryParams: { id }});
  }

  onConfirmBill(id: number) {
    this.rxSubscribe(this.confirmDialog.showDialog(), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.billService.confirmBill(id), () => {
          this.messageService.showMessage({
            detail: 'Xác nhận đơn hàng thành công.'
          });
          this.initData();
        })
      }
    })
  }

  conCancel(id: number) {
    this.rxSubscribe(this.confirmDialog.showDialog({
      confirmText: 'Bạn có muốn hủy đơn hàng này không?'
    }), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.billService.cancelBill(id), () => {
          this.messageService.showMessage({
            detail: 'Hủy đơn hàng thành công.'
          });
          this.initData();
        })
      }
    })
  }
}
