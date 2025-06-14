import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { map, of, switchMap } from 'rxjs';

import { BaseInputComponent } from '../../@components/base-input/base-input.component';
import { BaseComponent } from '../../@core/base/base.component';
import { BasePageResponse, Product } from '../../@core/models/product.model';
import { PromotionProgram } from '../../@core/models/promotion-program.model';
import { ProductService } from '../../@services/product.service';
import { PromotionProgramService } from '../../@services/promotion-program.service';
import { ImportModule } from '../../@themes/import.theme';

@Component({
  selector: 'app-update-promotion-program',
  standalone: true,
  templateUrl: './update-promotion-program.component.html',
  styleUrl: './update-promotion-program.scss',
  imports: [
    ImportModule,
    BaseInputComponent,
    JsonPipe
  ]
})
export class UpdatePromotionProgramComponent extends BaseComponent implements OnInit {
  private readonly promotionProgramService = inject(PromotionProgramService);
  private readonly productService = inject(ProductService);
  isEdit = signal(false);
  form!: FormGroup<{
    id: FormControl<number | null>;
    promotion_name: FormControl<string | null>;
    start_date: FormControl<Date | null>;
    end_date: FormControl<Date | null>
    percent_discount: FormControl<number | null>;
  }>;
  formProducts!: FormArray;
  minDate = signal<Date | null>(null);
  maxDate = signal<Date | null>(null);
  products = signal<Product[]>([]);
  id?:number;

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  initForm() {
    this.form = this.fb.group({
      id: new FormControl<number | null>(null),
      promotion_name: new FormControl<string | null>(null, [Validators.required]),
      start_date: new FormControl<Date | null>(null, [Validators.required]),
      end_date: new FormControl<Date | null>(null, [Validators.required]),
      percent_discount: new FormControl<number | null>(null, [Validators.required])
    });
    this.formProducts = this.fb.array([]);
  }

  initData() {
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => params['id']),
      switchMap(id => {
        if (id) {
          this.id = parseInt(id);
          this.isEdit.set(true);
          return this.promotionProgramService.getPromotionProgramById(id);
        }
        return of(null);
      }),
    ), (result: PromotionProgram) => {
      this.form.patchValue({
        ...result,
        start_date: dayjs(result.start_date).toDate(),
        end_date: dayjs(result.end_date).toDate()
      });
      result.products?.forEach(o => {
        this.addRowProduct(false , o);
      })
    });
    this.rxSubscribe(this.productService.getProducts(), (result: BasePageResponse<PromotionProgram>) => {
      this.products.set(result.data || []);
    })
  }

  onReturn() {
    this.router.navigate(['/admin/promotion-program']);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.formProducts.controls.length) {
      this.messageService.showMessage({
        summary: 'Error',
        severity: 'error',
        detail: 'Vui lòng chọn sản phẩm cho chương trình khuyến mại.'
      });
      return;
    }
    const isCheckSelectProduct = this.formProducts.controls.every(group => {
      if ((group as FormGroup).invalid || (group as FormGroup).controls['isEdit'].value === true) {
        return false;
      }
      return true;
    })
    if (!isCheckSelectProduct) {
      this.messageService.showMessage({
        summary: 'Error',
        severity: 'error',
        detail: 'Vui lòng chọn sản phẩm và save từng dòng trong danh sách sản phẩm.'
      });
      return;
    }
    const promotion = this.form.getRawValue() as unknown as PromotionProgram;
    promotion.product_ids = this.formProducts.controls.map(group => {
      const form = group as FormGroup;
      return form.controls['product']?.value.id;
    })
    promotion.start_date = dayjs(promotion.start_date).format('YYYY-MM-DD HH:mm:ss');
    promotion.end_date = dayjs(promotion.end_date).format('YYYY-MM-DD HH:mm:ss');
    promotion.id = this.id;
    console.log(this.id);
    this.rxSubscribe(this.promotionProgramService.savePromotion(promotion), () => {
      this.messageService.showMessage({
        detail: 'Thêm chương trình khuyến mại thành công.'
      })
      this.router.navigate(['/admin/promotion-program']);
    })
  }

  onDelete(index: number) {
    this.formProducts.removeAt(index);
  }

  onEdit(form: FormGroup) {
    form.controls['isEdit']?.setValue(true);
  }

  addRowProduct(isEdit = false ,value?: Product) {
    const group = this.fb.group({
      product: new FormControl<Product | null>(null, [Validators.required]),
      isEdit: [isEdit]
    });
    if (value) {
      group.patchValue({
        product: value
      })
    }
    this.formProducts.push(group);
  }

  onSaveRow(form: FormGroup) {
    form.controls['isEdit']?.setValue(false);
  }
}
