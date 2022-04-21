import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiURL = 'http://localhost:3040/api/v1/user';

  constructor(
    private http: HttpClient
  ) { }

  signup(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/signup`, body);
  }

  login(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, body);
  }

  requestOtp(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/request-otp`, body);
  }

  verifyOtp(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/verify-otp`, body);
  }

  changePassword(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/update-password`, body);
  }
}
