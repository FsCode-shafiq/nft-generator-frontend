import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { UsersService } from './users.service';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private user: UsersService,
    private router: Router,
    private snack: SnackbarService
  ) { }

  getStarted = () =>{

    let auth:any = localStorage.getItem('auth');
    if(auth){

      auth = JSON.parse(auth);
      const{token} = auth;
      this.user.authenticateUser({token}).subscribe(res=>{
        let {Error,message} = res;

        if(Error){
          this.snack.openSnackBar(message);
          this.router.navigate(['login']);
        }else{
          this.router.navigate(['/dashboard/generator'])
        }
      })
    }else{
      this.router.navigate(['login']);
    }

  }

  _deepClone(form:any){
    let ret:any = {};
    ret = _.cloneDeep(form.value);
    ret.layers.forEach((layer:any)=>{
      layer.images = layer.images.value
    })
    return ret
  }

}
