import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.page.html',
  styleUrls: ['./add-list.page.scss'],
})
export class AddListPage implements OnInit {
  addListForm: FormGroup;
  public = false;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.addListForm = this.fb.group({
      listName: new FormControl({ value: '', disabled: false }, Validators.required),
      public: false
    });
  }

  get f() { return this.addListForm.controls; }


  onSubmit() {
    this.myDismiss('submit');
  }

  async myDismiss(reason) {
    if (reason === 'submit'){
      const newListSettings = {listName: this.f.listName.value, public: this.f.public.value};
      await this.modalController.dismiss(newListSettings);
    } else {
      await this.modalController.dismiss();
    }
  }

}
