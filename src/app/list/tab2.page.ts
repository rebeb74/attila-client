import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { List } from '../models/list';
import { ApiService } from '../services/api.service';

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
  inputListLength = 1;
  inputListWidth = 'width : 0px';
  inputItemLength = 1;
  inputItemWidth = 'width : 0px';
  isEditingList = false;
  isEditingItem = false;
  isEditingItem$: Observable<string>;
  oldItemValue = '';
  noList = true;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.createForm();
    this.initialLoadLists(0);
  }

  initialLoadLists(indexList) {
    this.route.data.subscribe((data: { list: List[] }) => {
      if (data.list.length !== 0) {
        this.noList = false;
        this.myLists = data.list;
        this.selectedList = this.myLists[indexList];
        console.log('indexList', indexList);
        console.log('this.selectedList', this.selectedList);
        console.log('this.myLists', this.myLists);
        this.createItemForms();
      } else {
        this.noList = true;
      }
    });
  }

  createItemForms() {
    console.log('mylist', this.myLists);
    if (this.myLists !== []) {
      this.selectedList.list.forEach((item) => {
        this.t.push(this.fb.group({
          createdOn: item.createdOn,
          _id: item._id,
          value: item.value,
          checked: item.checked,
        }));
      });
    }
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

  get f() { return this.addListForm.controls; }
  get fi() { return this.addItemForm.controls; }
  get d() { return this.dynamicForm.controls; }
  get t() { return this.d.items as FormArray; }

  addList() {
    if (this.addInputListIsHidden) {
      this.inputListLength = 20;
      this.inputListWidth = 'width : 80%';
      this.addInputListIsHidden = false;
    } else {
      this.addInputListIsHidden = true;
      this.inputListLength = 1;
      this.inputListWidth = 'width : 0px';
      this.addListForm.reset(); // reset inputs
    }
    if (this.editBtnListIsHidden === true) {
      this.editBtnListIsHidden = false;
    }
  }

  createList() {
    this.noList = false;
    console.log('this.f.listName.value', this.f.listName.value);
    if (this.isEditingList === false) {
      this.myLists.unshift(
        {
          listName: this.f.listName.value
        }
      );
      this.apiService.createList({
        listName: this.f.listName.value
      }).subscribe(
        (success) => {
          console.log('liste créée', success);
        },
        (error) => {
          console.log(error);
        }
      );
      this.addInputListIsHidden = true;
      this.inputListLength = 1;
      this.inputListWidth = 'width : 0px';
      this.addListForm.reset(); // reset inputs
      this.selectedList = this.myLists[0];
      this.getLists(0);
    } else {
      this.selectedList.listName = this.f.listName.value;
      this.updateListById(this.selectedList._id, this.selectedList);
      this.addInputListIsHidden = true;
      this.editBtnListIsHidden = false;
      this.inputListLength = 1;
      this.inputListWidth = 'width : 0px';
      this.addListForm.reset(); // reset inputs
      this.isEditingList = false;
    }
  }

  updateListById(id, list) {
    this.apiService.updateListById(id, list).subscribe(
      (success) => {
        console.log('List updated', success);
        this.myLists.forEach((list, indexList) => {
          if (list._id === id) {
            this.getLists(indexList);
          }
        });
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  getLists(indexList) {
    this.apiService.getLists().subscribe(
      (success) => {
        this.myLists = success;
        if (this.myLists.length !== 0) {
          this.noList = false;
          this.selectedList = this.myLists[indexList];
          console.log('indexList', indexList);
          console.log('this.selectedList', this.selectedList);
          console.log('this.myLists', this.myLists);
          this.createItemForms();
        } else {
          this.noList = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editList() {

    if (this.addInputListIsHidden) {
      this.inputListLength = 20;
      this.inputListWidth = 'width : 80%';
      this.addInputListIsHidden = false;
      this.editBtnListIsHidden = true;
    } else {
      this.addInputListIsHidden = true;
      this.editBtnListIsHidden = false;
      this.inputListLength = 1;
      this.inputListWidth = 'width : 0px';
      this.addListForm.reset(); // reset inputs
    }
    this.isEditingList = true;
    this.f.listName.setValue(this.selectedList.listName);
  }

  deleteList() {
    this.apiService.deleteListById(this.selectedList._id).subscribe(
      (success) => {
        this.myLists.forEach((list, index) => {
          if (list._id === this.selectedList._id) {
            console.log('list deleted', success);
            console.log('this.myLists', ...this.myLists);
            this.myLists.splice(index, 1);
            console.log('this.myLists', ...this.myLists);
          }
        });
        this.getLists(0);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addItem() {
    if (this.addInputItemIsHidden) {
      this.addInputItemIsHidden = false;
      this.inputItemLength = 30;
      this.inputItemWidth = 'width : 100%';
    } else {
      this.addInputItemIsHidden = true;
      this.inputItemLength = 1;
      this.inputItemWidth = 'width : 0px';
      this.addItemForm.reset(); // reset inputs
    }
    console.log('addInputItemIsHidden', this.addInputItemIsHidden);
  }

  createItem() {
    console.log('this.fi.itemName.value', this.fi.itemName.value);
    if (this.fi.itemName.value !== '') {
      this.myLists.forEach((list: List, index) => {
        if (this.selectedList === list) {
          this.myLists[index].list.unshift(
            {
              value: this.fi.itemName.value
            }
          );
          this.updateListById(this.selectedList._id, this.selectedList);
          this.getLists(index);
        }
      });
      this.addItem();
    }
  }

  updateItem(newItem) {
    console.log('newItem', newItem);
    this.myLists.forEach((list: List, indexList) => {
      if (this.selectedList === list) {
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
          if (item._id === id.value._id) {
            this.myLists[indexList].list.splice(indexItem, 1);
          }
        });
      }
    });
    this.updateListById(this.selectedList._id, this.selectedList);
  }


  changeList(newSelectedList) {
    this.selectedList = newSelectedList;
    this.myLists.forEach((list: List, index) => {
      if (newSelectedList === list) {
        this.getLists(index);
      }
    });
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
