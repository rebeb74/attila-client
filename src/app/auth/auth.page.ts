import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  loginForm: FormGroup;


  public errorMessages = {
    username: [
      { type: 'required', message: 'Identifiant requis' },
    ],
    password: [
      { type: 'required', message: 'Mot de passe requis' },
    ]
  };
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: new FormControl(
        '',
        Validators.compose([
          Validators.required])),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required])),
    });
  }

  get f() { return this.loginForm.controls; }

  login() {
    this.authService.login(
      {
        username: this.f.username.value,
        password: this.f.password.value
      }
    )
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/tabs/tab1']);
          this.loginForm.reset(); // reset inputs
        }
      });
  }
}
