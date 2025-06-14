import { inject, Injectable } from "@angular/core"
import { HttpService } from "./http.service"
import { BasePage } from "../@core/models/bill.model";
import { map } from "rxjs";
import { RegisterBody } from "../@core/models/auth.model";

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly httpService = inject(HttpService);
  private readonly baseUrl = '/api/v1/users';

  getUsers(params: BasePage) {
    const url = this.baseUrl + '/get-all';
    return this.httpService.post(url, { data: params }).pipe(
      map(res => res.data)
    )
  }

  getUserById(id: number) {
    const url = this.baseUrl + `/get-one/${id}`;
    return this.httpService.get(url).pipe(
      map(res => res.data)
    )
  }

  deActiveUser(id: number) {
    const url = this.baseUrl + `/delete/${id}`;
    return this.httpService.delete(url);
  }

  activeUser(id: number) {
    const url = this.baseUrl + `/active/${id}`;
    return this.httpService.put(url);
  }

  addUser(data: RegisterBody) {
    return this.httpService.post('/auth/register', { data: data })
  }
}
