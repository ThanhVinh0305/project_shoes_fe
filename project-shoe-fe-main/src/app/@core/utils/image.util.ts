import { environment } from "../../../environments/environment";

export class ImageUtil {
  static replaceUrl(url: string) {
    return url.replace(/minio/g, environment.baseApi);
  }
}
