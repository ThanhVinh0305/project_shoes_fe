import { Component, OnInit, inject, signal } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../@core/base/base.component";
import { ImportModule } from "../../@themes/import.theme";
import { BaseInputComponent } from "../../@components/base-input/base-input.component";
import { SupplierService } from "../../@services/supplier.service";
import { Supplier } from "../../@core/models/supplier.model";
import { map, of, switchMap } from "rxjs";

@Component({
  selector: 'app-update-supplier',
  standalone: true,
  templateUrl: './update-supplier.component.html',
  styleUrl: './update-supplier.component.scss',
  imports: [
    ImportModule,
    BaseInputComponent
  ]
})
export class UpdateSupplierComponent extends BaseComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  isEdit = signal(false);
  form!: FormGroup<{
    name: FormControl<string | null>;
    phone_number: FormControl<string | null>;
    address: FormControl<string | null>
  }>;
  id?: number;

  ngOnInit(): void {
    this.initForm();
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => params['id']),
      switchMap(id => {
        if (id) {
          this.isEdit.set(true);
          this.id = id;
          return this.supplierService.getSupplierById(id);
        }
        return of(undefined);
      })
    ), (data: Supplier | undefined) => {
      if (data) {
        this.form.patchValue(data);
      }
    })
  }

  initForm() {
    this.form = this.fb.group({
      name: new FormControl<string | null>(null, [Validators.required]),
      phone_number: new FormControl<string | null>(null, [Validators.required]),
      address: new FormControl<string | null>(null, [Validators.required])
    })
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue() as Supplier;
    data.id = this.id;
    this.rxSubscribe(this.supplierService.updateSuplier(data, this.isEdit()), () => {
      this.messageService.showMessage({
        detail: `${ this.isEdit() ? 'Chỉnh sửa' : 'Thêm mới'} nhà cung cấp thành công.`
      });
      this.router.navigate(['/admin/supplier-management']);
    })
  }

  goReturn() {
    this.router.navigate(['/admin/supplier-management'])
  }
}
