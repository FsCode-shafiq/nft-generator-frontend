import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
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
}
