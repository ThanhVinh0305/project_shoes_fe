import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../../@core/base/base.component';
import { BaseInputComponent } from '../../@components/base-input/base-input.component';
import { RegisterBody } from '../../@core/models/auth.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ImportModule,
    BaseInputComponent,
    DropdownModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseComponent implements OnInit {
  form!: FormGroup;

  genderOptions = [
    { label: 'Nữ', value: 0 },
    { label: 'Nam', value: 1 }
  ];

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      genderId: [null, [Validators.required]],
    })
  }

  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authenticationService.register(this.form.getRawValue() as RegisterBody);
  }
}
