import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController
  ) { }

  async presentErrorPasswordToast() {
    const toast = await this.toastController.create({
      message: 'Mot de passe incorrect, votre mot de passe n\'a pas été modifié !',
      animated: true,
      color: 'danger',
      duration: 4000,
      translucent: false
    });
    toast.present();
  }

  async presentErrorShareToast() {
    const toast = await this.toastController.create({
      message: 'Partage échoué ! Identifiant introuvable.',
      animated: true,
      color: 'danger',
      duration: 4000,
      translucent: false
    });
    toast.present();
  }

  async presentErrorShareDoubleToast() {
    const toast = await this.toastController.create({
      message: 'Partage déjà ajouté !',
      animated: true,
      color: 'danger',
      duration: 4000,
      translucent: false
    });
    toast.present();
  }

  async presentSuccessShareToast() {
    const toast = await this.toastController.create({
      message: 'Partage ajouté !',
      animated: true,
      color: 'success',
      duration: 4000,
      translucent: false
    });
    toast.present();
  }

  async presentErrorAccountToast() {
    const toast = await this.toastController.create({
      message: 'L\'identifiant ou l\'email est déjà pris !',
      animated: true,
      color: 'danger',
      duration: 4000,
      translucent: false
    });
    toast.present();
  }

  async presentSuccessAccountToast() {
    const toast = await this.toastController.create({
      message: 'Modification effectuée',
      animated: true,
      color: 'success',
      duration: 4000,
      translucent: false
    });
    toast.present();
  }
}
