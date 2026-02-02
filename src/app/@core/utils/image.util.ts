import { environment } from "../../../environments/environment";

export class ImageUtil {
  static replaceUrl(url: string) {
    if (!url) return '';

    // Handle relative paths
    if (!url.startsWith('http')) {
      let path = url.startsWith('/') ? url : '/' + url;
      // Prepend bucket 'products' if missing and path needs it (heuristic based on observed data)
      if (!path.startsWith('/products')) {
        path = '/products' + path;
      }
      return environment.baseApi + path;
    }

    // Handle minio internal hostname
    if (url.includes('minio:9000')) {
      return url.replace('minio:9000', 'localhost:9000');
    }

    // If url starts with localhost:9000, it is already valid for local dev
    return url;
  }
}
