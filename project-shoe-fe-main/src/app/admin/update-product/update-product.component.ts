import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { forkJoin, map, of, switchMap } from 'rxjs';

import { BaseInputComponent } from '../../@components/base-input/base-input.component';
import { FileUploadComponent } from '../../@components/file-upload/file-upload.component';
import { BaseComponent } from '../../@core/base/base.component';
import { Category, Image, Product } from '../../@core/models/product.model';
import { Supplier } from '../../@core/models/supplier.model';
import { CategoryService } from '../../@services/category.service';
import { ProductService } from '../../@services/product.service';
import { SupplierService } from '../../@services/supplier.service';
import { UploadFileService } from '../../@services/upload.service';
import { ImportModule } from '../../@themes/import.theme';
import { noImage, sizes } from '../../@core/constants/constant';
import { environment } from '../../../environments/environment';
import { ImageUtil } from '../../@core/utils/image.util';

@Component({
  selector: 'app-update-product',
  standalone: true,
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
  imports: [
    ImportModule,
    CommonModule,
    FileUploadComponent,
    FormsModule,
    BaseInputComponent
  ]
})
export class UpdateProductComponent extends BaseComponent implements OnInit {
  private readonly uploadService = inject(UploadFileService);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  visible = false;
  form!: FormGroup<{
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    code: FormControl<string | null>;
    price: FormControl<number | null>;
    description: FormControl<string | null>;
    categories: FormControl<Category[] | null>;
    brand: FormControl<Supplier | null>;
    sizes: FormControl<number[] | null>;
  }>;
  categories = signal<Category[]>([]);
  suppliers = signal<Supplier[]>([]);
  sizes = sizes;
  urls = signal<Image[]>([]);
  urlsOrigin: Image[] = [];
  isEdit = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  initForm() {
    this.form = this.fb.group({
      id: new FormControl<number | null>(null),
      name: new FormControl<string | null>(null, [Validators.required]),
      code: new FormControl<string | null>(null, [Validators.required]),
      price: new FormControl<number | null>(null, [Validators.required]),
      description: new FormControl<string | null>(null, [Validators.required]),
      categories: new FormControl<Category[] | null>([], [Validators.required]),
      brand: new FormControl<Supplier | null>(null, Validators.required),
      sizes: new FormControl<number[] | null>([], Validators.required),
    })
  }

  initData() {
    this.rxSubscribe(
      forkJoin([
        this.categoryService.getAllCategory(),
        this.supplierService.getAllSupplier()
      ]),
      ([categoies, suppliers]) => {
        this.categories.set(categoies);
        this.suppliers.set(suppliers);
      }
    );
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => params['id']),
      switchMap(id => {
        if (id) {
          this.isEdit.set(true);
          return this.productService.getProductById(id);
        }
        return of(null);
      })
    ), (product: Product | null) => {
      if (product) {
        this.form.patchValue({
          ...product,
          sizes: product.sizes?.map(o => o.size || 0) || []
        });
        this.urlsOrigin = product.images || [];
        this.urls.set(product.images?.map(o => {
          o.attachment = o.attachment ? ImageUtil.replaceUrl(o.attachment) : noImage
          return o;
        }) || []);
      }
    })
  }

  onVisibleChange(visible: boolean) {
    this.visible = visible;
  }

  selectUrlFile(url: string) {
    this.urls.update(urls => {
      this.urlsOrigin.push(
        {
          attachment: url
        }
      )
      const image: Image = {
        attachment: url.replace(/minio/g, environment.baseApi)
      }
      urls.push(image);
      return urls;
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const product = this.form.getRawValue() as Product;
    product.categories = this.form.getRawValue().categories || [];
    product.brand_id = this.form.controls['brand']?.value?.id;
    product.images = this.urlsOrigin;
    this.rxSubscribe(this.productService.updateProduct(product), (value) => {
      this.messageService.showMessage({
        severity: 'success',
        summary: 'Success',
        detail: `${this.isEdit() ? 'Cập nhật thông tin' : 'Thêm mới'} sản phẩm thành công.`
      })
      this.router.navigate(['/admin/product-management'])
    })
  }

  onReturn() {
    this.router.navigate(['/admin/product-management']);
  }

  deleteImage(index: number) {
    this.rxSubscribe(this.confirmDelete.showDelete(), (confirm) => {
      if (confirm) {
        this.urls.update(urls => {
          urls.splice(index, 1);
          return urls;
        })
      }
    })
  }
}
