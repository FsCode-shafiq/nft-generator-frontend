import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide:boolean = true;


  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
    ) { }

  ngOnInit(): void {
  }
  showPassword(){
    const visibility =  document.getElementById('password')?.getAttribute('type');
    const setVisibility = visibility == 'password' ? 'text' : 'password';
    document.getElementById('password')?.setAttribute('type',setVisibility);
  }
  navToSignup(){

    this.router.navigate(['signup'])

  }
  
}
