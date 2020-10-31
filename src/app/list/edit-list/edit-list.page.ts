import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.page.html',
  styleUrls: ['./edit-list.page.scss'],
})
export class EditListPage implements OnInit {
  editListForm: FormGroup;
  @Input() listName: string;
  @Input() public: boolean;
  @Input() currentUserIsOwner: boolean;
  @Input() userName: string;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    console.log('this.listName', this.listName);
    console.log('this.public', this.public);
    this.createForm();
  }

  createForm() {
    console.log('currentUserIsOwner', this.currentUserIsOwner);
    this.editListForm = this.fb.group({
      listName: new FormControl({ value: this.listName, disabled: false }, Validators.required),
      userName: new FormControl({ value: this.userName, disabled: true }, Validators.required),
      public: new FormControl({ value: this.public, disabled: !this.currentUserIsOwner })
    });
  }

  get f() { return this.editListForm.controls; }


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
