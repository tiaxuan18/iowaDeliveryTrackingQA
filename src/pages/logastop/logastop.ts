import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../providers/loading';
import { TransferLogService } from '../../providers/transferlog';
import { HelperService } from '../../providers/helper';

import { InTransitPage } from '../intransit/intransit';

@Component({
  selector: 'page-logastop',
  templateUrl: 'logastop.html'
})
export class LogAStopPage {

  logastopFrm : FormGroup;
  items : any;
  transitItems : any;
  stopBegan : Boolean;
  t : any;

  constructor(public navCtrl : NavController, 
              private formBuilder : FormBuilder,
              private toast : ToastController,
              private storage : Storage,
              private loading : LoadingService,
              private transfer : TransferLogService,
              private helper : HelperService) {
    this.stopBegan = false;
    this.logastopFrm = this.formBuilder.group({
        reason : ['', Validators.required],
        description : ['', Validators.required]
    });
    this.loading.show();
    this.storage.get('intransit').then((tItems) => {
      this.transitItems = tItems;
      this.storage.get('loggedastop').then((lasItems) => {
        this.loading.hide();
        if (lasItems){
          this.items = lasItems;
          for(let i=0;i<this.items.length;i++){
            this.logastopFrm.controls['reason'].setValue(lasItems[i].reason);
            this.logastopFrm.controls['description'].setValue(lasItems[i].description);
          }
          this.stopBegan = true;
        } 
      });
     
    });
  }
  
  beginStop(){
    this.loading.show();
    this.items = [];
    for(let i=0;i<this.transitItems.length;i++){
      var body = {  colNames : ["Stop_reason__c", "Stop_details__c", "Begin_stop__c", "Transfer__c"],
                      vals : [this.logastopFrm.value.reason, this.logastopFrm.value.description, this.helper.formatDate(new Date()), this.transitItems[i].Id]}
      this.transfer.createLogAStop(body)
          .then( data => {
            if (i == (this.transitItems.length -1)){
              this.loading.hide(); 
              let t = this.toast.create({ message: 'Stop Logged', 
                                          duration: 5000, 
                                          position: 'top',
                                          showCloseButton: true,
                                          cssClass: 'toast-success'});
              t.present();
            }

            let res = <any>{};
            res = data;
            this.items.push(res.data);
            this.items[i].reason = this.logastopFrm.value.reason;
            this.items[i].description = this.logastopFrm.value.description;
            if (i == (this.transitItems.length -1)){
              this.storage.set('loggedastop', this.items);
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
  	
  resume(){
    this.loading.show();
    for(let i=0;i<this.items.length;i++){
      var body = {  colNames : ['Finish_stop__c'],
                    vals : [this.helper.formatDate(new Date())]}
      this.transfer.updateTransferLog(this.items[i].id, body)
            .then( data => {
              if (i==(this.items.length-1)){
                this.loading.hide(); 
                let t = this.toast.create({ message: 'Resumed', 
                                            duration: 5000, 
                                            position: 'top',
                                            showCloseButton: true,
                                            cssClass: 'toast-success'});
                t.present(); 
                this.storage.remove('loggedastop');
                t.onDidDismiss(() => {
                   this.navCtrl.setRoot(InTransitPage, {items: this.transitItems});  
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
