import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';

import { InputQuantityComponent } from '../@components/input-quantity/input-quantity.component';
import { SidebarComponent } from '../@components/sidebar/sidebar.component';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';


@NgModule({
  imports: [
    // import module with angular
    FormsModule,
    DecimalPipe,
    CurrencyPipe,
    ReactiveFormsModule,
    DatePipe,

    //import custom component
    InputQuantityComponent,
    SidebarComponent,
    // BaseInputComponent,

    //import module with primeng
    RippleModule,
    RatingModule,
    ButtonModule,
    InputNumberModule,
    CheckboxModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SidebarModule,
    AvatarModule,
    AvatarGroupModule,
    PanelMenuModule,
    MenuModule,
    BreadcrumbModule,
    TableModule,
    EditorModule,
    FileUploadModule,
    MultiSelectModule,
    InputTextareaModule,
    DividerModule,
    FloatLabelModule,
    InputMaskModule,
    PasswordModule,
    DialogModule,
    SliderModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    ProgressSpinnerModule,
    BadgeModule,
    ImageModule,
    DynamicDialogModule,
    CalendarModule,
    DropdownModule,
    PaginatorModule,
    ChartModule,
    TabViewModule
  ],
  exports: [
    // export module with angular
    FormsModule,
    DecimalPipe,
    CurrencyPipe,
    ReactiveFormsModule,
    DatePipe,

    // export custom component
    InputQuantityComponent,
    SidebarComponent,
    // BaseInputComponent,

    //export module with primeng
    RippleModule,
    RatingModule,
    ButtonModule,
    InputNumberModule,
    CheckboxModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SidebarModule,
    AvatarGroupModule,
    AvatarModule,
    PanelMenuModule,
    MenuModule,
    BreadcrumbModule,
    TableModule,
    EditorModule,
    FileUploadModule,
    MultiSelectModule,
    InputTextareaModule,
    DividerModule,
    FloatLabelModule,
    InputMaskModule,
    PasswordModule,
    DialogModule,
    SliderModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    ProgressSpinnerModule,
    BadgeModule,
    ImageModule,
    DynamicDialogModule,
    CalendarModule,
    DropdownModule,
    PaginatorModule,
    ChartModule,
    TabViewModule
  ]
})
export class ImportModule {}
