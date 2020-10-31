import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-share',
  templateUrl: './edit-share.page.html',
  styleUrls: ['./edit-share.page.scss'],
})
export class EditSharePage implements OnInit {
  shareEditForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.shareEditForm = this.fb.group({
      username: new FormControl({ value: '', disabled: false }, Validators.required),
    });
  }

  get f() { return this.shareEditForm.controls; }


  onSubmit() {
    this.myDismiss();
  }

  async myDismiss() {
    const newUserSettings = {share: this.f.username.value};
    await this.modalController.dismiss(newUserSettings);
  }
}


