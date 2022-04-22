import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, Params, ActivatedRouteSnapshot, ActivatedRoute, ActivationEnd, ActivationStart } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { MessageServiceService } from '../Services/message-service.service';
import { SnackbarService } from '../Services/snackbar.service';
import { UsersService } from '../Services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('otpboxes') otpboxes: ElementRef | any;

  private unSubscribe = new Subject();

  hide: boolean = true;

  active: boolean = false;

  forgetFlow = {
    email: false,
    otp: false,
    password: false
  }

  loginForm: FormGroup | any;
  ForgotFlowForm: FormGroup | any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private msg: MessageServiceService,
    private snack: SnackbarService,
    private user: UsersService,
    private fb: FormBuilder,
    private Ar: ActivatedRoute
  ) { }


  ngOnInit(): void {

    this.googleSignin();
    this.setloginForm();
    this.setForgotFlowForm();
    this.msg.currentMsg.pipe(takeUntil(this.unSubscribe)).subscribe(res => this.messageHandler(res));

  }


  messageHandler(msg: string) {
    switch (msg) {
      case 'get-email':
        this.active = true;
        this.forgetFlow.email = true;
        break;
      case 'otp':
        this.requestOtp();
        break;
      case 'password':
        this.verifyOtp();
        break;
      case 'reset':
        this.resetFlow();
        break;
      default:
        break;
    }
  }

  requestOtp = () => {

    const payload = {
      email: this.ForgotFlowForm.value.email
    }

    this.user.requestOtp(payload).pipe(takeUntil(this.unSubscribe)).subscribe(res => {

      let { Error, message } = res;

      this.snack.openSnackBar(message);

      if (!Error) {
        this.forgetFlow.email = false;
        this.forgetFlow.otp = true;
      }
    })

  }

  verifyOtp = () => {
    // console.log(this.otpboxes.otpForm.value);
    let formValues = Object.values(this.otpboxes.otpForm.value);
    let code = '';

    formValues.forEach((ele: any) => {
      code = code.concat(ele);
    })

    const payload = {
      email: this.ForgotFlowForm.value.email,
      otp: code,
    }

    this.user.verifyOtp(payload).pipe(takeUntil(this.unSubscribe)).subscribe(res => {

      let { Error, message } = res;

      this.snack.openSnackBar(message);

      if (!Error) {
        this.forgetFlow.otp = false;
        this.forgetFlow.password = true;
      }

    })
  }

  changePassword = (form: FormGroup) => {
    let { password, cPassword, email } = form.value;
    let sendRequest: boolean = true;
    if (!form.valid) {
      this.snack.openSnackBar('Enter password and confirmed password!')
      // return 0;
    }
    else {
      if (password.length < 6 || cPassword.length < 6) {
        this.snack.openSnackBar('Enter minimume 6 character of password');
        sendRequest = false;
      }
      if (password !== cPassword) {
        this.snack.openSnackBar('password Mismatch!');
        sendRequest = false;
      }

      if (sendRequest) {

        const payload = {
          email: email,
          password: password
        }
        this.user.changePassword(payload).pipe(takeUntil(this.unSubscribe)).subscribe(res => {

          let { Error, message } = res;

          this.snack.openSnackBar(message);

          if (!Error) {
            this.resetFlow();
          }

        })
      }
    }
    // console.log(form.value);
  }

  setloginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.minLength(6)]
    })
  }

  setForgotFlowForm() {
    this.ForgotFlowForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      cPassword: ['', Validators.required]
    })
  }

  googleSignin() {
    let { id } = this.Ar.snapshot.queryParams;
    if (id) {
      this.user.googleSignIn({ id }).pipe(takeUntil(this.unSubscribe)).subscribe(res => {
        let { Error, message } = res;

        if (!Error) {
          let auth = JSON.stringify(message);
          localStorage.setItem('auth', auth);
          localStorage.setItem('isLoggedin', 'true');
          this.snack.openSnackBar('Login Successfully');
          this.msg.changeMessage('loggedIn');
          this.router.navigate(['dashboard/generator']);
        } else {
          this.snack.openSnackBar(message);
        }
      })
    }
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      this.snack.openSnackBar('Please provide All required fields')
    } else {
      this.user.login(form.value).pipe(takeUntil(this.unSubscribe)).subscribe(res => {

        let { Error, message } = res;

        if (!Error) {

          let auth = JSON.stringify(message);

          localStorage.setItem("auth", auth);
          localStorage.setItem('isLoggedin', 'true');
          this.msg.changeMessage('loggedIn');
          this.router.navigate(['dashboard/generator']);

        } else {

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

  loginwithgoogle() {
    window.open('http://localhost:3040/api/v1/auth/google', '_self');
  }
  ngOnDestroy(): void {
    this.unSubscribe.next('');
    this.unSubscribe.complete();
    this.msg.changeMessage('')
  }
}
