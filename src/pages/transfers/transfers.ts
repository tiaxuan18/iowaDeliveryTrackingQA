import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { OpportunityService } from '../../providers/opportunity';
import { LoadingService } from '../../providers/loading';

import { TransferDetailPage } from '../transferdetail/transferdetail';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-transfers',
  templateUrl: 'transfers.html'
})
export class TransfersPage {
  data: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toast: ToastController,
              private storage: Storage,
              public oppoService : OpportunityService,
              public loading: LoadingService) {
    this.data = {transfers:[], returns:[]};
    this.loading.show();
    this.storage.get('user').then((user) => {

      oppoService.getTransfers(user.Employer__c)
        .then( data => {
          this.loading.hide();
          this.storage.set('transfers', data);
          this.data = data;

        })
        .catch( errorReq => {
          this.loading.hide();
          var errorObj  = JSON.parse(errorReq._body);
          if (errorObj.message){
            let t = this.toast.create({ message:errorObj.message, 
                                duration: 5000, 
                                position: 'top',
                                showCloseButton: true,
                                cssClass: 'toast-error'});
            t.present();
          }
        });
    });
  }

  itemTapped(item) {
    this.navCtrl.push(TransferDetailPage, {
      item: item
    });
  }

  goHome() {
    this.navCtrl.setRoot(HomePage); 
  }

}
