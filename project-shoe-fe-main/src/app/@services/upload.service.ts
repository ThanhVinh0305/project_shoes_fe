import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private readonly httpService = inject(HttpService);

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('files[]', new Blob([file as any]));
    return this.httpService.post('/api/v1/file/upload-file', { data: formData });
  }
}
