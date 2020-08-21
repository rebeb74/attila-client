import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ModalController } from '@ionic/angular';
import { EditUserAccountPage } from './edit-user-account/edit-user-account.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  userAccountForm: FormGroup;
  currentUser: User;
  showEditButton = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getCurrentUser();
    this.createForm();

  }

  getCurrentUser() {
    this.route.data.subscribe((data: { user: User }) => {
      this.currentUser = data.user;
      console.log(this.currentUser);
    });
  }

  get f() { return this.userAccountForm.controls; }

  createForm() {
    this.userAccountForm = this.fb.group({
      email: new FormControl({ value: this.currentUser.email, disabled: true }, Validators.required),
      username: new FormControl({ value: this.currentUser.username, disabled: true }, Validators.required),
    });
  }

  async openModal() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: EditUserAccountPage,
        componentProps: {
          email: this.currentUser.email,
          username: this.currentUser.username
        }
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        console.log('The result:', detail.data);
        this.currentUser.email = detail.data.newEmail;
        this.currentUser.username = detail.data.newUsername;
        this.apiService.updateUserById(this.currentUser._id, this.currentUser).subscribe();
        this.authService.storeUsername(this.currentUser.username);
      }
    });
    await modal.present();
  }
}
