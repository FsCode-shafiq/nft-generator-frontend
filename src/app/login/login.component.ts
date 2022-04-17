import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageServiceService } from '../Services/message-service.service';

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
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private msg: MessageServiceService
  ) { }


  ngOnInit(): void {

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
