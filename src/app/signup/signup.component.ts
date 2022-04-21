import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup , FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../Services/snackbar.service';
import { UsersService } from '../Services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit , OnDestroy{

  unsubcribe = new Subject();
  signupForm: FormGroup | any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snack: SnackbarService,
    public user: UsersService
  ) { }
  
  ngOnInit(): void {
   this.setForm();
  }

  setForm(){
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.minLength(6)]
    })
  }
  
  onSubmit = (form:FormGroup)=> {
    if(!form.valid){
      this.snack.openSnackBar('please provide All required fields correctly')
    }
    else{
      this.user.signup(form.value).pipe(takeUntil(this.unsubcribe)).subscribe(res=>{
        let {Error, message} = res;
        this.snack.openSnackBar(message);
        if(!Error){
          this.router.navigate(['login']);
        }
      });
    }
  }
  
  showPassword() {
    const visibility = document.getElementById('password')?.getAttribute('type');
    const setVisibility = visibility == 'password' ? 'text' : 'password';
    document.getElementById('password')?.setAttribute('type', setVisibility);
    document.getElementById('Cpassword')?.setAttribute('type', setVisibility);
  }
  navToLogin() {
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    this.unsubcribe.next('');
    this.unsubcribe.complete();
  }
}
