import { Component, OnInit, inject, signal } from '@angular/core';
import { BaseComponent } from '../../@core/base/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportModule } from '../../@themes/import.theme';
import { BaseInputComponent } from "../../@components/base-input/base-input.component";
import { FileUploadComponent } from "../../@components/file-upload/file-upload.component";
import { CategoryService } from '../../@services/category.service';
import { Category } from '../../@core/models/product.model';
import { map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ImageUtil } from '../../@core/utils/image.util';

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [
    ImportModule,
    BaseInputComponent,
    FileUploadComponent
],
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.scss'
})
export class UpdateCategoryComponent extends BaseComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  isEdit = signal(false);
  image = signal<string | undefined>(undefined);
  visible = false;
  category = signal<Category>({});
  id?: number;
  form!: FormGroup<{
    name: FormControl<string | null>;
    router_link: FormControl<string | null>;
  }>;
  imageUrlOrigin = '';

  ngOnInit(): void {
    this.initForm();
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => params['id']),
      switchMap(id => {
        if (id) {
          this.id = id;
          this.isEdit.set(true);
          return this.categoryService.getCategoryById(id);
        }
        return of(undefined);
      })
    ), (data: Category | undefined) => {
      if (data) {
        this.category.set(data);
        this.form.patchValue(data);
        this.image.set(data.image);
      }
    })
  }

  initForm() {
    this.form = this.fb.group({
      name: new FormControl<string | null>(null, [Validators.required]),
      router_link: new FormControl<string | null>(null, [Validators.required]),
    })
  }

  onVisibleChange(visible: boolean) {
    this.visible = visible;
  }

  selectUrlFile(url: string) {
    this.image.set(ImageUtil.replaceUrl(url));
    this.imageUrlOrigin = url;
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // if (!this.image()) {
    //   this.messageService.showMessage({
    //     severity: 'warning',
    //     summary: 'Warn',
    //     detail: 'Vui lòng chọn ảnh cho danh mục.'
    //   })
    //   return;
    // }
    const data: Category = this.form.getRawValue() as Category;
    data.image = this.imageUrlOrigin;
    data.id = this.id;
    this.rxSubscribe(this.categoryService.updateCategory(data, this.isEdit()), (result) => {
      this.messageService.showMessage({
        detail:  `${this.isEdit() ? 'Chỉnh sửa' : 'Thêm mới'} sản phẩm thành công.`
      });
      this.router.navigate(['/admin/category-management']);
    })
  }

  goReturn() {
    this.router.navigate(['/admin/category-management'])
  }
}
