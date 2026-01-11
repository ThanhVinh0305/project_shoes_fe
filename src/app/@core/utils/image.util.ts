import { environment } from "../../../environments/environment";

export class ImageUtil {
  static replaceUrl(url: string) {
    if (!url) return '';
    // Nếu là localhost:9000 thì thay bằng baseApi
    if (url.startsWith('http://localhost:9000') || url.startsWith('https://localhost:9000')) {
      // Giữ nguyên path sau /products/...
      const path = url.replace(/^https?:\/\/localhost:9000/, '');
      return environment.baseApi + path;
    }
    // Nếu là minio hoặc các trường hợp khác, thay minio bằng baseApi
    if (url.includes('minio')) {
      return url.replace(/minio/g, environment.baseApi);
    }
    // Nếu đã là domain đúng thì giữ nguyên
    return url;
  }
}
