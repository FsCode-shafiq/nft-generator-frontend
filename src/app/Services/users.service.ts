import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiURL = 'http://localhost:3040/api/v1';

  constructor(
    private http: HttpClient
  ) { }

  signup(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/user/signup`, body);
  }

  login(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/user/login`, body);
  }

  requestOtp(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/user/request-otp`, body);
  }

  verifyOtp(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/user/verify-otp`, body);
  }

  changePassword(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/user/update-password`, body);
  }

  googleSignIn(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/auth/google/signin`, body);
  }

  googleLogout(): Observable<any> {
    return this.http.get(`${this.apiURL}/auth/google/logout`);
  }

  authenticateUser(body: Object): Observable<any> {
    return this.http.post(`${this.apiURL}/user/authenticate-user`, body);
  }
}
