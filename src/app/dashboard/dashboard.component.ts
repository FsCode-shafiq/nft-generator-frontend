import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageServiceService } from '../Services/message-service.service';
import { SnackbarService } from '../Services/snackbar.service';
import { UsersService } from '../Services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  unsubscribe = new Subject();
  constructor(
    private router: Router,
    private user: UsersService,
    private snack: SnackbarService,
    private msg: MessageServiceService
  ) { }

  ngOnInit(): void {

  }

  navigateToHome(){
    this.router.navigate(['/']);
  }

  logout = () => {
    let auth: any = localStorage.getItem('auth');
    if (auth) {
      auth = JSON.parse(auth);
      let { isGoogleAcc } = auth;
      if (isGoogleAcc) {
        this.user.googleLogout().pipe(takeUntil(this.unsubscribe)).subscribe(res => {
          this.snack.openSnackBar(res.message);
          localStorage.clear();
          this.msg.changeMessage('logout');
          this.router.navigate(['/']);
        })
      } else {
        localStorage.clear();
        this.router.navigate(['/']);
      }
    }
  }

}
