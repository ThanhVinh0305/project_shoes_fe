import { Component, inject, OnInit, signal } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { TablePageEvent } from "primeng/table";
import { BaseComponent } from "../../@core/base/base.component";
import { PromotionParamSearch, PromotionProgram } from "../../@core/models/promotion-program.model";
import { PromotionProgramService } from "../../@services/promotion-program.service";
import { BasePageResponse } from "../../@core/models/product.model";

@Component({
  selector: 'app-promotion-program',
  standalone: true,
  templateUrl: './promotion-program.component.html',
  styleUrl: './promotion-program.component.scss',
  imports: [
    ImportModule
  ]
})
export class PromotionProgramComponent extends BaseComponent implements OnInit{
  private readonly promotionProgramService = inject(PromotionProgramService);
  promotions = signal<PromotionProgram[]>([]);

  rowsPerPageOptions = signal([10, 15 , 20, 30]);
  first = signal(0);
  rows = signal(this.rowsPerPageOptions()[0]);
  totalRecords = signal(0);
  params: PromotionParamSearch = {
    page: this.first() + 1,
    size: this.rows()
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.rxSubscribe(this.promotionProgramService.getPromotionProgram(this.params), (result: BasePageResponse<PromotionProgram>) => {
      this.promotions.set(result.data || []);
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

  goAdd() {
    this.router.navigate(['admin/promotion-program/update-promotion-program']);
  }

  onEdit(id: number) {
    this.router.navigate(['/admin/promotion-program/update-promotion-program'], { queryParams: { id: id}});
  }

  onDelete(id: number) {
    this.rxSubscribe(this.confirmDelete.showDelete(), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.promotionProgramService.deletePromotionProgram(id), () => {
          this.messageService.showMessage({
            detail: 'Xóa chương trình khuyến mại thành công.'
          })
          this.initData();
        })
      }
    })
  }
}
