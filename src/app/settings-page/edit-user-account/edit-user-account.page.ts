import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user-account',
  templateUrl: './edit-user-account.page.html',
  styleUrls: ['./edit-user-account.page.scss'],
})
export class EditUserAccountPage implements OnInit {
  @Input() email: string;
  @Input() username: string;
  userEditForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.userEditForm = this.fb.group({
      email: new FormControl({ value: this.email, disabled: false }, Validators.required),
      username: new FormControl({ value: this.username, disabled: false }, Validators.required),
    });
  }

  get f() { return this.userEditForm.controls; }

  onSubmit() {
    this.myDismiss('submit');
  }

  async myDismiss(reason) {
    if (reason === 'submit') {
      const newUserSettings = { email: this.f.email.value, username: this.f.username.value };
      await this.modalController.dismiss(newUserSettings);
    } else {
      await this.modalController.dismiss();
    }
  }
}
