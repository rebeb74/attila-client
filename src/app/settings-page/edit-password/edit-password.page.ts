import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
})
export class EditPasswordPage implements OnInit {
  editPasswordForm: FormGroup;
  newPasswordConfirm$: Observable<string>;
  confirmPassword: string;
  confirmPasswordValid = true;


  public errorMessages = {
    oldPassword: [
      { type: 'required', message: 'Ancien mot de passe requis' }
    ],
    newPassword: [
      { type: 'required', message: 'Nouveau mot de passe requis' },
      { type: 'pattern', message: 'Doit contenir des lettres et chiffres et être d\'une longueur entre 4 et 15 caractères' },
    ],
    newPasswordConfirm: [
      { type: 'required', message: 'Confirmation de mot de passe requis' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm();
    this.validConfirmPassword();
  }

  createForm() {
    this.editPasswordForm = this.fb.group({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[0-9]).{4,15}')
        ])),
      newPasswordConfirm: new FormControl('', Validators.required),
    },
      {
        validator: this.authService.mustMatch('newPassword', 'newPasswordConfirm')
      }
    );
  }
  get f() { return this.editPasswordForm.controls; }

  validConfirmPassword() {
    this.newPasswordConfirm$ = this.editPasswordForm.controls['newPasswordConfirm'].valueChanges;
    this.newPasswordConfirm$
      .subscribe((data) => {
        if (this.f.newPassword.value !== data) {
          return this.confirmPasswordValid = false;
        } else {
          return this.confirmPasswordValid = true;
        }
      });
  }

  onSubmit() {
    this.myDismiss('submit');
  }

  async myDismiss(reason) {
    if (reason === 'submit') {
      const passwordSettings = { oldPassword: this.f.oldPassword.value, newPassword: this.f.newPassword.value };
      await this.modalController.dismiss(passwordSettings);
    } else {
      await this.modalController.dismiss();
    }
  }

}

