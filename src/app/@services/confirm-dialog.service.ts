import { Injectable, inject } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { ConfirmDeleteDialogComponent } from "../@components/confirm-dialog/confirm-delete.component";

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly dialogService = inject(DialogService);

  showDialog(data?: ConfirmDialogData) {
    let dataDialog: ConfirmDialogData = {
      icon: 'pi pi-question-circle',
      confirmText: 'Bạn có chắc chán xác nhận hoàn thành đơn hàng này ?',
      confirmLabelButton: "Xác nhận"
    };
    if (data) {
      dataDialog = Object.assign(dataDialog, data);
    }
    const ref = this.dialogService.open(ConfirmDeleteDialogComponent, {
      width: '25rem',
      modal: true,
      data: dataDialog
    })
    return ref.onClose;
  }
}

export interface ConfirmDialogData {
  icon?: string;
  confirmText?: string;
  confirmLabelButton?: string;
}
