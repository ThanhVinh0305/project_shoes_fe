import { Component, OnInit, inject, signal } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';
import { Category } from '../../@core/models/product.model';
import { TablePageEvent } from 'primeng/table';
import { BaseComponent } from '../../@core/base/base.component';
import { CategoryService } from '../../@services/category.service';
import { ImageUtil } from '../../@core/utils/image.util';
import { noImage } from '../../@core/constants/constant';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    ImportModule
  ],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent extends BaseComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);

  first = signal(0);
  rows = signal(10);

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.rxSubscribe(this.categoryService.getAllCategory(), (data: Category[]) => {
      this.categories.set(data.map(o => {
        return {
          ...o,
          image: o.image ? ImageUtil.replaceUrl(o.image) : noImage
        }
      }));
    })
  }

  pageChange(event: TablePageEvent) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  rowsChange(value: number) {
    this.rows.set(value);
  }

  goAddCategory() {
    this.router.navigate(['admin/category-management/update-category']);
  }

  onEdit(id: number) {
    this.router.navigate(['/admin/category-management/update-category'], { queryParams: { id: id}});
  }

  onDelete(id: number) {
    this.rxSubscribe(this.confirmDelete.showDelete(), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.categoryService.deleteCategory(id), () => {
          this.messageService.showMessage({
            detail: 'Xóa danh mục thành công.'
          })
          this.initData();
        })
      }
    })
  }
}
