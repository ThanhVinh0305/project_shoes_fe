import { Component, OnInit, inject, signal } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { TablePageEvent } from "primeng/table";
import { BaseComponent } from "../../@core/base/base.component";
import { Category } from "../../@core/models/product.model";
import { SupplierService } from "../../@services/supplier.service";
import { Supplier } from "../../@core/models/supplier.model";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-supplier-management',
  standalone: true,
  templateUrl: './supplier-management.component.html',
  styleUrl: './supplier-management.component.scss',
  imports: [
    ImportModule,
    FormsModule
  ]
})
export class SupplierManagementComponent extends BaseComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  suppliers = signal<Supplier[]>([]);

  first = signal(0);
  rows = signal(10);

  initData() {
    this.rxSubscribe(this.supplierService.getAllSupplier(), (data: Supplier[]) => {
      this.suppliers.set(data);
    })
  }

  ngOnInit(): void {
    this.initData();
  }

  pageChange(event: TablePageEvent) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  rowsChange(value: number) {
    this.rows.set(value);
  }

  goAdd() {
    this.router.navigate(['admin/supplier-management/update-supplier']);
  }

  onEdit(id: number) {
    this.router.navigate(['/admin/supplier-management/update-supplier'], { queryParams: { id: id}});
  }

  onDelete(id: number) {
    this.rxSubscribe(this.confirmDelete.showDelete(), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.supplierService.deleteSupplier(id), () => {
          this.messageService.showMessage({
            detail: 'Xóa danh mục thành công.'
          })
          this.initData();
        })
      }
    })
  }
}

interface City {
  name: string;
  code: string;
}
