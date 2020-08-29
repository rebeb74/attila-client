import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  passwordConfirm$: Observable<string>;
  confirmPassword: string;
  confirmPasswordValid = true;

  public errorMessages = {
    email: [
      { type: 'required', message: 'Email requis' },
      { type: 'pattern', message: 'Format d\'email incorrect' },
    ],
    username: [
      { type: 'required', message: 'Identifiant requis' },
      { type: 'minLength', message: '4 caractères minimum' },
      { type: 'maxLength', message: '12 caractères maximum' },
    ],
    password: [
      { type: 'required', message: 'Mot de passe requis' },
      { type: 'pattern', message: 'Doit contenir des lettres et chiffres et être d\'une longueur entre 4 et 15 caractères' },
    ],
    passwordConfirm: [
      { type: 'required', message: 'Confirmation de mot de passe requis' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.createForm();
    this.validConfirmPassword();

  }

  get f() { return this.registerForm.controls; }

  createForm(){
    this.registerForm = this.fb.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
        ])),
      username: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(12)
        ])),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[0-9]).{4,15}'),
        ])),
      passwordConfirm: new FormControl('', Validators.required)
    },
      {
        validator: this.authService.mustMatch('password', 'passwordConfirm')
      }
    );
  }

  validConfirmPassword() {
    this.passwordConfirm$ = this.registerForm.get('passwordConfirm').valueChanges;
    this.passwordConfirm$
      .subscribe((data) => {
        if (this.f.password.value !== data) {
          return this.confirmPasswordValid = false;
        } else {
          return this.confirmPasswordValid = true;
        }
      });

  }

  register() {
    this.authService.register(
      {
        email: this.f.email.value,
        username: this.f.username.value,
        password: this.f.password.value
      }
    )
      .subscribe(res => {
        if (res === 201) {
          this.toastController.dismiss();
          this.authService.login(
            {
              username: this.f.username.value,
              password: this.f.password.value
            }
          )
            .subscribe(loginSuccess => {
              if (loginSuccess) {
                this.router.navigate(['/tabs/tab1']);
              }
            });
        } else if (res === 409) {
          this.presentToast();
          console.log('Identifiant ou Email déjà utilisé.');
        }
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Identifiant ou Email déjà utilisé.',
      animated: true,
      color: 'danger',
      translucent: true
    });
    toast.present();
  }
}
