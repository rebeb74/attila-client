import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-share-list-popover',
  templateUrl: './share-list-popover.page.html',
  styleUrls: ['./share-list-popover.page.scss'],
})
export class ShareListPopoverPage implements OnInit {
  @Input() shareList: [];

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {
  }

  async dismissPopover(calUsername){
    await this.popoverController.dismiss(calUsername);
  }
}
