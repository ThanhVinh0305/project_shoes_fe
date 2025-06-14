import { Component, EventEmitter, inject, Input, input, Output, output, Renderer2 } from "@angular/core";
import { DragAndDropFileDirective } from "./drag-and-drop-file.directive";
import { MessagesService } from "../../@services/message.service";
import { ImportModule } from "../../@themes/import.theme";
import { BaseComponent } from "../../@core/base/base.component";
import { UploadFileService } from "../../@services/upload.service";
import { map } from "rxjs";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  imports: [
    DragAndDropFileDirective,
    ImportModule
  ]
})
export class FileUploadComponent extends BaseComponent {
  private readonly renderer = inject(Renderer2);
  private readonly uploadService = inject(UploadFileService);
  private readonly typeImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  urlFile = output<string>();
  file?: File;

  outputFile(file: File) {
    this.file = file;
  }

  onSelectImage() {
    const input = this.renderer.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = ($event: any) => {
      const file = $event.target.files[0];
      if (file.size > 5000000) {
        this.messageService.showMessage({
          severity: 'warning',
          summary: 'Warn',
          detail: 'Vui lòng không chọn file có dung lượng lớn hơn 5MB'
        })
        return;
      }
      if (!this.typeImage.includes(file.type.split('/')[1])) {
        this.messageService.showMessage({
          severity: 'warning',
          summary: 'Warn',
          detail: `Sai định dạng ảnh. Chỉ được upload các file có đuôi ${this.typeImage.join(',')}`
        })
        return;
      }
      this.file = file;
    }
  }

  uploadImage() {
    if (this.file) {
      this.rxSubscribe<string[]>(this.uploadService.uploadFile(this.file).pipe(map(res => res.data)), (value) => {
        this.urlFile.emit(value[0]);
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.file = undefined;
      })
    }
  }
}
