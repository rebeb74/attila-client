import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

import { List } from '../models/list';
import { User } from '../models/user';

import { ApiService } from '../services/api.service';


import { AddListPage } from './add-list/add-list.page';
import { EditListPage } from './edit-list/edit-list.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  addListForm: FormGroup;
  addItemForm: FormGroup;
  editItemForm: FormGroup;
  dynamicForm: FormGroup;
  myLists: List[] = [];
  addInputListIsHidden = true;
  editBtnListIsHidden = false;
  addInputItemIsHidden = true;
  selectedList: List;
  oldItemValue = '';
  noList = true;
  currentUser: User;
  shareList = [];
  currentUserIsOwner: boolean;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    // Get Current User
    this.getCurrentUser();
    // Create forms
    this.createForm();
    // Load Lists
    this.initialGetLists(0);
    this.clearEmptyItems();
    this.createItemForms();
  }

  getCurrentUser() {
    this.route.data.subscribe((data: { user: User }) => {
      this.currentUser = data.user;
      console.log(this.currentUser);
    });
  }

  sortListByDate(list) {
    list.sort((a: List, b: List) => {
      return (new Date(b.createdOn)).getTime() - (new Date(a.createdOn)).getTime();
    });
  }

  createForm() {
    this.addListForm = this.fb.group({
      listName: '',
    });
    this.addItemForm = this.fb.group({
      itemName: '',
    });
    this.dynamicForm = this.fb.group({
      items: new FormArray([])
    });
  }

  get fi() { return this.addItemForm.controls; }
  get d() { return this.dynamicForm.controls; }
  get t() { return this.d.items as FormArray; }

  async addList() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: AddListPage
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail.data !== undefined) {
        this.myLists.unshift(
          {
            listName: detail.data.listName,
            public: detail.data.public,
            userName: this.currentUser.username
          }
        );
        this.apiService.createList({
          listName: detail.data.listName,
          public: detail.data.public,
          userName: this.currentUser.username
        }).subscribe(
          (success) => {
            console.log('liste créée', success);
          },
          (error) => {
            console.log(error);
          }
        );
        this.getLists(0);
        this.clearEmptyItems();
      }
    });
    await modal.present();
  }

  getLists(indexSelectedList) {
    this.apiService.getLists().subscribe((data: List[]) => {
      console.log('data', data);
      if (data.length !== 0) {
        this.noList = false;
        this.myLists = data;
        this.sortListByDate(this.myLists);
        this.selectedList = this.myLists[indexSelectedList];
        this.checkListOwnership();
      } else {
        this.noList = true;
      }
    },
      (error) => {
        console.log(error);
      });
  }

  initialGetLists(indexSelectedList) {
    this.route.data.subscribe((data: { list: List[] }) => {
      if (data.list.length !== 0) {
        this.noList = false;
        this.myLists = data.list;
        this.sortListByDate(this.myLists);
        this.selectedList = this.myLists[indexSelectedList];
        this.checkListOwnership();
      } else {
        this.noList = true;
      }
    },
      (error) => {
        console.log(error);
      });
  }

  checkListOwnership() {
    if (this.selectedList.userName === this.currentUser.username) {
      this.currentUserIsOwner = true;
    } else {
      this.currentUserIsOwner = false;
    }
  }

  async editList() {
    this.checkListOwnership();
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: EditListPage,
        componentProps: {
          listName: this.selectedList.listName,
          public: this.selectedList.public,
          userName: this.selectedList.userName,
          currentUserIsOwner: this.currentUserIsOwner
        }
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      console.log('detail', detail);
      if (detail.data !== undefined) {
        this.selectedList.listName = detail.data.listName;
        this.selectedList.public = detail.data.public;
        this.updateListById(this.selectedList._id, this.selectedList);
      }
    });
    await modal.present();
  }

  clearEmptyItems() {
    this.selectedList.list.forEach((item, index) => {
      if (item.value === '') {
        this.selectedList.list.splice(index, 1);
      }
    });
  }

  updateListById(id, list) {
    console.log('list', list);
    this.apiService.updateListById(id, list).subscribe(
      (success) => {
        this.myLists.forEach((oldList, indexList) => {
          if (oldList._id === id) {
            console.log('oldList.public', oldList.public);
            console.log('success', success);
            this.getLists(indexList);
          }
        });
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  deleteList() {
    this.apiService.deleteListById(this.selectedList._id).subscribe(
      (success) => {
        this.myLists.forEach((list, index) => {
          if (list._id === this.selectedList._id) {
            this.myLists.splice(index, 1);
            this.selectedList = this.myLists[index];
          }
        });
        this.getLists(0);
        this.createItemForms();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createItemForms() {
    this.t.controls = [];
    if (this.myLists.length !== 0) {
      this.selectedList.list.forEach((item) => {
        this.t.push(this.fb.group({
          createdOn: item.createdOn,
          _id: item._id,
          value: item.value,
          checked: item.checked,
        }));
      });
    }
    console.log('this.selectedList', this.selectedList);
    console.log('t', this.t);
  }

  addItem() {
    this.clearEmptyItems();
    this.myLists.forEach((list: List, index) => {
      if (this.selectedList === list) {
        this.myLists[index].list.push(
          {
            value: '',
            checked: false
          }
        );
        this.apiService.updateListById(this.selectedList._id, this.selectedList).subscribe(
          () => {
            this.apiService.getLists().subscribe((data: List[]) => {
              this.myLists = data;
              console.log('this.selectedList', this.selectedList);
              this.sortListByDate(this.myLists);
              this.selectedList = this.myLists[index];
              this.checkListOwnership();
              this.createItemForms();
            },
              (error) => {
                console.log(error);
              });
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  updateItem(newItem) {
    console.log('newItem', newItem);
    this.myLists.forEach((list: List, indexList) => {
      if (this.selectedList._id === list._id) {
        this.myLists[indexList].list.forEach((item, indexItem) => {
          if (newItem._id === item._id) {
            this.myLists[indexList].list[indexItem].value = newItem.value;
            this.updateListById(this.selectedList._id, this.selectedList);
          }
        });
      }
    });
  }

  deleteItem(id) {
    this.myLists.forEach((list: List, indexList) => {
      if (this.selectedList === list) {
        this.myLists[indexList].list.forEach((item, indexItem) => {
          if (item._id === id) {
            this.myLists[indexList].list.splice(indexItem, 1);
          }
        });
      }
    });
    this.updateListById(this.selectedList._id, this.selectedList);
    this.createItemForms();
  }


  changeList(newSelectedList) {
    this.selectedList = newSelectedList;
    this.checkListOwnership();
    this.myLists.forEach((list: List, index) => {
      if (newSelectedList === list) {
        this.getLists(index);
      }
    });
    this.clearEmptyItems();
    this.createItemForms();
  }

  changeItemCheck(editItem) {
    this.myLists.forEach((list: List, indexList) => {
      if (this.selectedList === list) {
        list.list.forEach((item, indexItem) => {
          if (item._id === editItem._id) {
            if (this.myLists[indexList].list[indexItem].checked) {
              this.myLists[indexList].list[indexItem].checked = false;
            } else {
              this.myLists[indexList].list[indexItem].checked = true;
            }
          }
        });
      }
    });
    this.updateListById(this.selectedList._id, this.selectedList);
  }
}
