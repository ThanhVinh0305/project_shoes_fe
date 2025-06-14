import { Component, OnInit, inject, signal } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { BaseComponent } from "../../@core/base/base.component";
import { ConfirmDeleteDialogService } from "../../@services/confirm-delete.service";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss',
  imports: [
    ImportModule,
  ],
  providers: [DialogService]
})
export class ConfirmDeleteDialogComponent {
  icon = signal('pi pi-trash');
  confirmText = signal('Bạn có chắc chắn xóa thông tin này ?');
  confirmLabelButton = signal("Xóa");
  constructor(private ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    if (config.data) {
      this.icon.set(config.data.icon);
      this.confirmText.set(config.data.confirmText);
      this.confirmLabelButton.set(config.data.confirmLabelButton);
    }
  }

  onCancel() {
    this.ref.close(false);
  }

  onConfirm() {
    this.ref.close(true);
  }
}
