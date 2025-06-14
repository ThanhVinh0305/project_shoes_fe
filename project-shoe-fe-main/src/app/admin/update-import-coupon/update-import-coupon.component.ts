import { SupplierService } from './../../@services/supplier.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';
import { BaseComponent } from '../../@core/base/base.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Supplier } from '../../@core/models/supplier.model';
import { BaseInputComponent } from '../../@components/base-input/base-input.component';
import { ParamSearch, Product, Size } from '../../@core/models/product.model';
import { ImportCoupon, ProductAmounts } from '../../@core/models/import-coupon.model';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { ProductService } from '../../@services/product.service';
import { ImportCouponService } from '../../@services/import-coupon.service';

@Component({
  selector: 'app-update-import-coupon',
  standalone: true,
  imports: [
    ImportModule,
    BaseInputComponent
  ],
  templateUrl: './update-import-coupon.component.html',
})
export class UpdateImportCouponComponent extends BaseComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly productService = inject(ProductService);
  private readonly importCouponService = inject(ImportCouponService);
  isEdit = signal(false);
  form!: FormGroup<{
    brand: FormControl<Supplier | null>;
    description: FormControl<string | null>;
  }>;
  formProducts!: FormArray;
  products = signal<Product[]>([]);
  suppliers = signal<Supplier[]>([]);
  id?: number;
  importCoupon?: ImportCoupon;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      brand: new FormControl<Supplier | null>(null, [Validators.required]),
      description: new FormControl<string | null>(null)
    })
    this.formProducts = this.fb.array([]);
    this.initData();
  }

  initData() {
    this.rxSubscribe(
      forkJoin([
        this.supplierService.getAllSupplier(),
        this.productService.getProducts().pipe(
          map(res => res.data)
        )
      ]),
      ([suppliers, products]) => {
        this.suppliers.set(suppliers);
        this.products.set(products);
      }
    );
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => params['id']),
      switchMap(id => {
        if (id) {
          this.id = id;
          this.isEdit.set(true);
          return this.importCouponService.getImportCouponById(id);
        }
        return of(undefined);
      })
    ), ((result: ImportCoupon | undefined) => {
      this.importCoupon = result;
      this.form.patchValue({
        ...result,
      });
      this.onChangeSupplier();
      result?.products?.forEach(value => this.addRowProduct(false, value));
      this.disableForm(result?.status || 0);
    }))
  }

  onChangeSupplier() {
    if (this.form.controls['brand'].value) {
      const params: ParamSearch = {
        brands: [this.form.controls['brand'].value.id ?? 0],
        page: 1,
        size: 3000000
      }
      this.rxSubscribe(this.productService.getProducts(params).pipe(
        map(res => res.data)
      ), products => {
        this.products.set(products);
      });
      this.formProducts.controls.forEach(group => {
        (group as FormGroup).reset();
      })
    }
  }

  onReturn() {
    this.router.navigate(['/admin/import-coupon-management']);
  }

  onSave(isConfirm?: boolean) {
    if (this.isEdit() && isConfirm) {
      this.rxSubscribe(this.confirmDialog.showDialog(), (confirm) => {
        if (confirm) {
          this.rxSubscribe(this.importCouponService.confirm(this.id || 0), () => {
            this.messageService.showMessage({
              detail: 'Hoàn thành phiếu nhập thành công.'
            })
            this.onReturn();
            return;
          })
        }
      })
    } else if (isConfirm) {
      this.rxSubscribe(this.confirmDialog.showDialog(), (confirm) => {
        if (confirm) {
          this.saveCoupon(isConfirm);
        }
      })
    } else {
      this.saveCoupon()
    }
  }

  saveCoupon(isConfirm?: boolean) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let isCheck = false;
    this.formProducts.controls.forEach(group => {
      if ((group as FormGroup).invalid) {
        isCheck = true;
      }
    })
    if (isCheck) {
      this.messageService.showMessage({
        summary: 'Error',
        severity: 'error',
        detail: 'Vui lòng hoàn thành các thông tin trong bảng và lưu lại trước khi tạo phiếu nhập.'
      })
      return;
    }
    const data: ImportCoupon = {
      brand_id: this.form.controls['brand']?.value?.id,
      description: this.form.controls['description'].value || ''
    }
    data.product_amounts = this.formProducts.controls.map(group => {
      return (group as FormGroup).getRawValue() as ProductAmounts;
    });
    data.is_confirm = isConfirm;
    data.id = this.id;
    this.rxSubscribe(this.importCouponService.updateImportCoupon(data), () => {
      this.messageService.showMessage({
        detail: `${this.isEdit() ? "Cập nhật" : 'Thêm' } phiếu nhập thành công.`
      });
      this.router.navigate(['/admin/import-coupon-management']);
    })
  }

  onSaveRow(form: FormGroup) {
    form.controls['isEdit']?.setValue(false);
  }

  onEdit(form: FormGroup) {
    form.controls['isEdit']?.setValue(true);
  }

  onDelete(index: number) {
    this.formProducts.removeAt(index);
  }

  addRowProduct(isEdit = false, value?: ProductAmounts) {
    const group = this.fb.group({
      product_id: new FormControl<number | null>(null),
      product: new FormControl<Product | null>(null, [Validators.required]),
      size: new FormControl<number | null>(null, [Validators.required]),
      import_cost: new FormControl<number | null>(null, [Validators.required]),
      amount: new FormControl<number | null>(null, [Validators.required]),
      sizes: new FormControl<Size[]>([]),
      total: new FormControl<number | null>(null),
      isEdit: [isEdit]
    });
    if (value) {
      group.patchValue({
        ...value,
        product_id: value.product?.id,
        sizes: value.product?.sizes
      });
      this.calculateTotal(group);
    }
    this.formProducts.push(group);
  }

  onSelectProduct(form: FormGroup) {
    if (form.controls['product_id'].value) {
      const product = this.products().find(o => o.id === form.controls['product_id'].value);
      form.controls['product']?.setValue(product);
      form.controls['sizes']?.setValue(product?.sizes);
    } else {
      form.controls['sizes']?.setValue(null);
      form.controls['product']?.setValue(null);
    }
  }

  calculateTotal(form: FormGroup) {
    if (form.controls['amount'].value && form.controls['import_cost'].value) {
      form.controls['total'].setValue(form.controls['amount'].value * form.controls['import_cost'].value);
      return;
    }
    form.controls['total'].setValue(0);
  }

  disableForm(status: number) {
    if (status === 1) {
      this.form.disable();
      this.formProducts.disable();
    }
  }
}
