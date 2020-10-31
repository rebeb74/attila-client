import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

import { User } from '../models/user';

import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

import { EditUserAccountPage } from './edit-user-account/edit-user-account.page';
import { EditPasswordPage } from './edit-password/edit-password.page';
import { EditSharePage } from './edit-share/edit-share.page';

import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  userAccountForm: FormGroup;
  currentUser: User;
  showEditButton = false;
  emptyShare = true;
  doubleShare: boolean;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalController: ModalController,
    private toastService: ToastService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.getCurrentUser();
    this.createForm();
    this.checkShare();
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

  checkShare() {
    if (this.currentUser.share.length > 0) {
      this.emptyShare = false;
    } else {
      this.emptyShare = true;
    }
  }

  addShare(detail) {
    console.log('detail.data.share', detail.data.share);
    this.apiService.getUserByUsername(detail.data.share).subscribe(
      (user) => {

        console.log('user._id', user._id);
        console.log('user.username', user.username);
        this.currentUser.share.push({
          id: user._id,
          email: user.email,
          username: user.username
        });
        this.checkShare();
        this.apiService.updateUserById(this.currentUser._id, this.currentUser).subscribe(
          (success) => {
            this.toastService.presentSuccessShareToast();
          },
          (error) => {
            this.toastService.presentErrorShareToast();
          }
        );
      },
      (error) => {
        this.toastService.presentErrorShareToast();
      }
    );
  }

  deleteShare(shareToDelete) {
    this.currentUser.share.forEach((shareUser, index) => {
      if (shareUser === shareToDelete) {
        this.currentUser.share.splice(index, 1);
      }
      this.apiService.getUserByUsername(shareUser.username).subscribe(
        (success) => {
          success.isShared.forEach((isSharedUser, index2) => {
            if (isSharedUser.id === this.currentUser._id) {
              success.isShared.splice(index2, 1);
            }
          });
          this.apiService.updateUserIsSharedById(success._id, success).subscribe();
        },
        (error) => {
          this.toastService.presentErrorShareToast();
        }
      );
    });
    this.checkShare();
    this.apiService.updateUserById(this.currentUser._id, this.currentUser).subscribe();
  }

  async openModalParameters() {
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
        this.currentUser.email = detail.data.email;
        this.currentUser.username = detail.data.username;
        this.apiService.updateUserById(this.currentUser._id, this.currentUser).subscribe(
          (success) => {
            this.userAccountForm.patchValue({ email: this.currentUser.email, username: this.currentUser.username });
            this.toastService.presentSuccessAccountToast();
          },
          (error) => {
            this.toastService.presentErrorAccountToast();
          }
        );
      }
    });
    await modal.present();
  }

  async openModalShare() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: EditSharePage
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        if (this.emptyShare) {
          this.addShare(detail);
        } else {
          this.currentUser.share.forEach((share) => {
            console.log('share', share);
            console.log('detail.data.share', detail.data.share);
            if (share === detail.data.share) {
              this.doubleShare = true;
            }
          });
          if (this.doubleShare) {
            this.toastService.presentErrorShareDoubleToast();
            this.doubleShare = false;
          } else {
            this.addShare(detail);
          }
        }
      }
    });
    await modal.present();
  }

  async openModalPassword() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: EditPasswordPage
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        const data = {
          username: this.currentUser.username,
          oldPassword: detail.data.oldPassword,
          newPassword: detail.data.newPassword
        };
        console.log(detail.data);
        this.apiService.updatePassword(data).subscribe(
          (success) => {
            if (success.message === 'Password Changed') {
              this.authService.logout().subscribe();
            }
          },
          (error) => {
            if (error.error.error === 'Wrong old password') {
              this.toastService.presentErrorPasswordToast();
            }
          }
        );
      }
    });
    await modal.present();
  }

  logout() {
    this.authService.logout().subscribe();
  }

}
