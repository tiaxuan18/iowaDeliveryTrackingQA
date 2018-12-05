import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';
import { LoadingService } from '../../providers/loading';
import { OpportunityService } from '../../providers/opportunity';
import { TransferLogService } from '../../providers/transferlog';
import { TransferGPSService } from '../../providers/transfergps';
import { HelperService } from '../../providers/helper';


@Component({
  selector: 'page-transferowner',
  templateUrl: 'transferowner.html'
})
export class TransferOwnerPage {

  transOwnerFrm : FormGroup;
  transitItems : any;

  constructor(public navCtrl: NavController, 
              private formBuilder: FormBuilder,
              private toast: ToastController,
              private storage: Storage,
              private oppoService : OpportunityService,
              private loading: LoadingService,
              private transfer : TransferLogService,
              private transferGPS : TransferGPSService,
              private helper : HelperService) {
    this.transOwnerFrm = this.formBuilder.group({
    	reason: ['', Validators.required]
    });
    this.storage.get('intransit').then((tItem) => {
      this.transitItems = tItem;
    });
  }

  transferItem(){
    this.loading.show();
    for(let i=0;i<this.transitItems.length;i++){
      var body = { colNames : ['Transfer_Ownership_Reason__c',"Transfer__c"],
                     vals : [this.transOwnerFrm.value.reason, this.transitItems[i].Id]}
      if (i == (this.transitItems.length -1)){
        this.transferGPS.stopGPSTracking().then( result => {
          this.transferOwner(body);
        }).catch( errorReq => {
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
      } else {
      debugger;
        this.transferOwner(body);
      }
    }
      

  }

  transferOwner(body){
    this.transfer.createTransferOwner(body)
      .then( data => {
          this.transferOpportunity();
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
  }
  	
  transferOpportunity(){

    for(let i=0;i<this.transitItems.length;i++){
      var bodyOppo = { colNames : ['Arrival_time__c', 'Status__c', 'Driver__c'],
                     vals : [this.helper.formatDate(new Date()), 'Pending', 'NULL']}           
      this.oppoService.updateOpportunity(this.transitItems[i].Id, bodyOppo)
            .then( data => {
              if (i == (this.transitItems.length -1)){
                this.loading.hide();
                let t = this.toast.create({ message: 'The item has been put back in process', 
                                            duration: 5000, 
                                            position: 'top',
                                            showCloseButton: true,
                                            cssClass: 'toast-success'});
                t.present(); 
                this.storage.remove('intransit');
                t.onDidDismiss(() => {
                   this.navCtrl.setRoot(HomePage);  
                });
              }
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
     }
  }
  	
}
