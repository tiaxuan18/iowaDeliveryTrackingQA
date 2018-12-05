import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../providers/loading';
import { EmployeeService } from '../../providers/employee';

import { HomePage } from '../home/home';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginFrm : FormGroup;

  constructor(private navCtrl: NavController, 
              private toast: ToastController,
              private storage: Storage,
              private formBuilder: FormBuilder,
              public employeeService : EmployeeService,
              private loading: LoadingService) {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.loginFrm = this.formBuilder.group({
      username: new FormControl('', [Validators.required,, Validators.pattern(EMAILPATTERN)]),
      password: new FormControl('', [Validators.required])
    });
   
  }
  	
  onLogin(){
    this.loading.show();

    this.employeeService.findByEmail(this.loginFrm.value.username, this.loginFrm.value.password)
      .then( data => {
        this.loading.hide();
        let res = <any>{};
        res = data;
        this.storage.set('user', res.data);
        this.navCtrl.setRoot(HomePage, {}); 
      })
      .catch( errorReq => {
          this.loading.hide();
          var errorObj  = JSON.parse(errorReq._body);
          let t = this.toast.create({ message:errorObj.message, 
                              duration: 5000, 
                              position: 'top',
                              showCloseButton: true,
                              cssClass: 'toast-error'});
          t.present();
      })
  }

  onForgotPassword(){
    if (this.loginFrm.value.username != ''){
      this.loading.show();
      this.employeeService.resetPassword(this.loginFrm.value.username)
        .then( data => {
          this.loading.hide();
          let t = this.toast.create({ message: 'You will receive a email with additional instructions', 
                                duration: 5000, 
                                position: 'top',
                                showCloseButton: true,
                                cssClass: 'toast-success'});
            t.present();

        })
        .catch( errorReq => {
            this.loading.hide();
            var errorObj  = JSON.parse(errorReq._body);
            let t = this.toast.create({ message:errorObj.message, 
                                duration: 5000, 
                                position: 'top',
                                showCloseButton: true,
                                cssClass: 'toast-error'});
            t.present();
        })
      } else {
         let t = this.toast.create({ message: 'Email is required to reset password', 
                                duration: 5000, 
                                position: 'top',
                                showCloseButton: true,
                                cssClass: 'toast-error'});
          t.present();

      }
  }
  	
}
