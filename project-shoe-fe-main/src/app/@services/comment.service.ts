import { inject, Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { map } from "rxjs";
import { Comment, CreateCommentBody } from "../@core/models/comment.model";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly httpService = inject(HttpService);
  private readonly urlBase = `/api/v1/comment`

  getCommentByProductId(id: number) {
    const url = `/open-api/comments/get-all/${id}`;
    return this.httpService.get(url).pipe(
      map(res => res.data)
    )
  }

  create(data: CreateCommentBody) {
    const url = this.urlBase + '/create';
    return this.httpService.post(url, { data: data });
  }

  update(data: Comment) {
    const url = this.urlBase + '/update';
    return this.httpService.put(url, { data: data });
  }

  delete(id: number) {
    const url = this.urlBase + `/${id}`;
    return this.httpService.delete(url);
  }
}
