import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { OpportunityService } from '../../providers/opportunity';
import { LoadingService } from '../../providers/loading';

import { TransfersPage } from '../transfers/transfers';

@Component({
  selector: 'page-transfers',
  templateUrl: 'transferdetail.html'
})
export class TransferDetailPage {
  item: any;
  lines : any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private storage: Storage,
              private toast: ToastController,
              public loading: LoadingService,
              public oppoService : OpportunityService) {

    this.loading.show();
    this.item = this.navParams.data.item;
    this.loading.hide();
  }

  addToItinerary(){
    this.loading.show();
    this.storage.get('user').then((user) => {
      var body = { colNames : ['Driver__c', 'Status__c'],
                   vals : [user.Id, 'Pending']}

      this.oppoService.updateOpportunity(this.item.Id, body)
        .then( data => {
          this.loading.hide();  
          this.navCtrl.setRoot(TransfersPage); 
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

}
