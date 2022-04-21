import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageServiceService } from '../Services/message-service.service';
import { SnackbarService } from '../Services/snackbar.service';
import { UsersService } from '../Services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private unSubscribe = new Subject();

  hide: boolean = true;

  active: boolean = false;

  forgetFlow = {
    email: false,
    otp: false,
    password: false
  }

  loginForm: FormGroup | any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private msg: MessageServiceService,
    private snack: SnackbarService,
    private user: UsersService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {

    this.setloginForm();
    this.msg.currentMsg.pipe(takeUntil(this.unSubscribe)).subscribe(res => this.messageHandler(res));

  }


  messageHandler(msg: string) {
    switch (msg) {
      case 'get-email':
        this.active = true;
        this.forgetFlow.email = true;
        break;
      case 'otp':
        this.forgetFlow.email = false;
        this.forgetFlow.otp = true;
        break;
      case 'password':
        this.forgetFlow.otp = false;
        this.forgetFlow.password = true;
        break;
      case 'reset':
        this.resetFlow();
        break;
      default:
        break;
    }
  }

  setloginForm() {
    this.loginForm = this.fb.group({
      email: ['',  Validators.email],
      password: ['', Validators.minLength(6)]
    })
  }

  onSubmit(form: FormGroup) {
    
    if(!form.valid){
      this.snack.openSnackBar('Please provide All required fields')
    }else{
      this.user.login(form.value).pipe(takeUntil(this.unSubscribe)).subscribe(res=>{

        let {Error, message} = res;
        
        if(!Error){

          let auth = JSON.stringify(message);
          
          localStorage.setItem("auth",auth);

          this.router.navigate(['dashboard/generator']);

        }else{

          this.snack.openSnackBar(message);

        }
      })
    }
  }

  forgotFlow(msg: string) {
    this.msg.changeMessage(msg)
  }

  resetFlow() {
    this.cdr.detach();
    this.forgetFlow = {
      email: false,
      otp: false,
      password: false
    }
    this.active = false;
    this.cdr.reattach();
  }
  showPassword() {
    const visibility = document.getElementById('password')?.getAttribute('type');
    const setVisibility = visibility == 'password' ? 'text' : 'password';
    document.getElementById('password')?.setAttribute('type', setVisibility);
    document.getElementById('Cpassword')?.setAttribute('type', setVisibility);
  }
  navToSignup() {

    this.router.navigate(['signup']);

  }
  ngOnDestroy(): void {
    this.unSubscribe.next('');
    this.unSubscribe.complete();
    this.msg.changeMessage('')
  }
}
