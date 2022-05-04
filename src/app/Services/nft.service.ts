import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NftService {

  apiURL = 'http://localhost:3040/api/v1';
  
  constructor(
    private http: HttpClient
  ) { }

  setInformation(body:any): Observable<any>{
    return this.http.post(`${this.apiURL}/nft/set-info`,body);
  }
  setImages(body:any): Observable<any>{
    return this.http.post(`${this.apiURL}/nft/set-images`,body);
  }
}
