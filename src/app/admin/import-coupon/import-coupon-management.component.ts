import { Component, inject, OnInit, signal } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';
import { TablePageEvent } from 'primeng/table';
import { BaseComponent } from '../../@core/base/base.component';
import { ImportCouponService } from '../../@services/import-coupon.service';
import { ImportCoupon, ParamsPage } from '../../@core/models/import-coupon.model';
import { map } from 'rxjs';
import { BasePageResponse } from '../../@core/models/product.model';

@Component({
  selector: 'app-import-coupon-management',
  standalone: true,
  templateUrl: './import-coupon-management.component.html',
  styleUrl: 'import-coupon-management.component.scss',
  imports: [ImportModule],
})
export class ImportCouponManagementComponent
  extends BaseComponent
  implements OnInit
{
  private readonly importCouponService = inject(ImportCouponService);
  coupons  = signal<ImportCoupon[]>([]);
  first = signal(0);
  rows = signal(10);
  params: ParamsPage = {
    page: this.first() + 1,
    size: this.rows(),
  };
  totalRecords = signal(0);

  pageChange(event: TablePageEvent) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  goAdd() {
    this.router.navigate([
      '/admin/import-coupon-management/update-import-coupon',
    ]);
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.rxSubscribe(
      this.importCouponService.getImportCoupon(this.params),
      (result: BasePageResponse<ImportCoupon>) => {
        this.coupons.set(result.data || []);
        this.totalRecords.set(result.total || 0);
      }
    );
  }

  onEdit(id: number) {
    this.router.navigate(['/admin/import-coupon-management/update-import-coupon'], { queryParams: { id }});
  }

  confirmCoupon(id: number) {
    this.rxSubscribe(this.confirmDialog.showDialog(), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.importCouponService.confirm(id), (value) => {
          this.messageService.showMessage({
            detail: "Hoàn thành phiếu nhập thành công."
          });
          this.initData();
        })
      }
    })
  }

  onDelete(id: number) {
    this.rxSubscribe(this.confirmDelete.showDelete(), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.importCouponService.deleteImportCoupon(id), () => {
          this.messageService.showMessage({
            detail: 'Xóa phiếu nhập thành công.'
          });
          this.initData();
        })
      }
    })
  }
}
