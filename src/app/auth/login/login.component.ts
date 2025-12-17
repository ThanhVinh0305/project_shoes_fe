import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BaseInputComponent } from '../../@components/base-input/base-input.component';
import { BaseComponent } from '../../@core/base/base.component';
import { LoginBody } from '../../@core/models/auth.model';
import { ImportModule } from '../../@themes/import.theme';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    CheckboxModule,
    ButtonModule,
    ImportModule,
    BaseInputComponent,
    ToastModule
  ],
  providers: [MessageService]
})
export class LoginComponent extends BaseComponent implements OnInit {

  form!: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: LoginBody = {
      username: (this.form.controls['username'].value || '').trim(),
      password: this.form.controls['password'].value || ''
    };

    // Nếu thiếu dữ liệu thì báo lỗi sớm, không gọi API
    if (!payload.username || !payload.password) {
      this.messageService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Tên đăng nhập và mật khẩu không được bỏ trống'
      });
      return;
    }

    this.authenticationService.login(payload, this.currentUrl);
  }
}
