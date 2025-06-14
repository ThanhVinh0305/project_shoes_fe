import { ROLE_ADMIN, ROLE_CUSTOMER, ROLES } from './../../@core/constants/constant';
import { Component, inject, OnInit, signal } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { BaseInputComponent } from "../../@components/base-input/base-input.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../@core/base/base.component";
import { map, of, switchMap } from "rxjs";
import { UserManagementService } from "../../@services/user-management.service";
import { User } from "../../@core/models/auth.model";

@Component({
  selector: 'app-update-user',
  standalone: true,
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss',
  imports: [
    ImportModule,
    BaseInputComponent
  ]
})
export class UpdateUserComponent extends BaseComponent implements OnInit {
  private readonly userManagementService = inject(UserManagementService);
  isEdit = signal(false);
  id?: number;
  user = signal<User>({});

  form!: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    first_name: FormControl<string | null>;
    last_name: FormControl<string | null>;
    phone_number: FormControl<string | null>;
    email: FormControl<string | null>;
    address: FormControl<string | null>;
    role: FormControl<string | null>;
  }>;
  ROLES = ROLES;

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  initForm() {
    this.form = this.fb.group({
      username: [''],
      password: [''],
      confirmPassword: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
    this.updateValidateForm();
  }

  initData() {
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => params['id']),
      switchMap(id => {
        if (id) {
          this.id = id;
          this.isEdit.set(true);
          this.updateValidateForm();
          return this.userManagementService.getUserById(id);
        }
        return of();
      })
    ), (user) => {
      this.user.set(user);
      this.form.patchValue(user);
      this.form.patchValue({
        role: user.admin ? ROLE_ADMIN : ROLE_CUSTOMER
      })
    })
  }

  updateValidateForm() {
    if (!this.isEdit()) {
      this.form.controls['username']?.addValidators([Validators.required]);
      this.form.controls['username']?.updateValueAndValidity();
      this.form.controls['password']?.addValidators([Validators.required]);
      this.form.controls['password']?.updateValueAndValidity();
      this.form.controls['confirmPassword']?.addValidators([Validators.required]);
      this.form.controls['confirmPassword']?.updateValueAndValidity();
    } else {
      this.form.controls['username']?.clearValidators();
      this.form.controls['username']?.updateValueAndValidity();
      this.form.controls['password']?.clearValidators();
      this.form.controls['password']?.updateValueAndValidity();
      this.form.controls['confirmPassword']?.clearValidators();
      this.form.controls['confirmPassword']?.updateValueAndValidity();
    }
  }

  goReturn() {
    this.router.navigate(['/admin/user-management']);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    };
    const data = this.form.getRawValue() as User;
    if (this.isEdit()) {
      data.id = this.id;
    }
    if (this.form.controls['role'].value === ROLE_ADMIN) {
      data.is_admin = true;
    }
    this.rxSubscribe(
      !this.isEdit() ? this.userManagementService.addUser(data) : this.authenticationService.updateUser(data),
      () => {
        this.messageService.showMessage({
          detail: `${this.isEdit() ? 'Thêm mới' : 'Cập nhật' } người dùng thành công.`
        });
        this.router.navigate(['/admin/user-management'])
      }
    )
  }
}
