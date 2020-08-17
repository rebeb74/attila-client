import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  user: User = {
    email: '',
    username: '',
    password: ''
  };
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: '',
      username: '',
      password: ''
    });
  }

  get f() { return this.registerForm.controls; }

  register() {
    this.authService.register(
      {
        email: this.f.email.value,
        username: this.f.username.value,
        password: this.f.password.value
      }
    )
      .subscribe(registerSuccess => {
        if (registerSuccess) {
          this.authService.login(
            {
              username: this.f.username.value,
              password: this.f.password.value
            }
          )
          .subscribe(loginSuccess => {
            if(loginSuccess){
              this.router.navigate(['/tabs/tab1']);
            }
          })
        }
      });
  }
}
