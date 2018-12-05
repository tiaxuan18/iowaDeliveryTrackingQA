import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';


@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html'
})
export class LogoutPage {
  
  constructor(	private navCtrl: NavController, 
  				private storage : Storage) {
  	this.storage.clear();
    this.navCtrl.setRoot(LoginPage);
  }
  	
}
