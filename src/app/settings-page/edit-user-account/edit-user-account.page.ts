import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user-account',
  templateUrl: './edit-user-account.page.html',
  styleUrls: ['./edit-user-account.page.scss'],
})
export class EditUserAccountPage implements OnInit {
  userEditForm: FormGroup;
  currentUserEmail: string;
  currentUserUsername: string;
  isFormLoaded = false;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.currentUserEmail = this.navParams.get('email');
    console.log('ngOnInit');
    this.currentUserUsername = this.navParams.get('username');
    this.createForm();
    this.userEditForm.patchValue({email: this.currentUserEmail, username: this.currentUserUsername});
  }

  createForm() {
    console.log('currentUserEmail1', this.currentUserEmail);
    console.log('currentUserUsername1', this.currentUserUsername);
    this.userEditForm = this.fb.group({
      email: new FormControl({ value: this.currentUserEmail, disabled: true }, Validators.required),
      username: new FormControl({ value: this.currentUserUsername, disabled: true }, Validators.required),
    });
    console.log('this.f.email.value', this.f.email.value);
    console.log('this.f.username.value', this.f.username.value);
  }

  get f() { return this.userEditForm.controls; }

  onSubmit() {
    this.currentUserEmail = this.f.email.value;
    this.currentUserUsername = this.f.username.value;
    console.log('mail modifié', this.currentUserEmail);
    console.log('username modifié', this.currentUserUsername);
    this.myDismiss();
  }

  ionViewWillEnter() {
    console.log('willEnter');

  }

  ionViewDidEnter() {
  console.log('didEnter');
  }

  async myDismiss() {
    console.log('mail modifié', this.currentUserEmail);
    console.log('username modifié', this.currentUserUsername);
    const newEmail = this.currentUserEmail;
    const newUsername = this.currentUserUsername;
    await this.modalController.dismiss(newEmail);
  }
}
