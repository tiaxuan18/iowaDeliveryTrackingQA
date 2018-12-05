import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingService {
	
	loading : any;

	constructor(private loadingCtrl: LoadingController) {
    }

    show(){
       this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
    	this.loading.present();
    }

    hide(){
        if (this.loading) {
            try {
                this.loading.dismiss();
            }
            catch (exception) {

            }
            this.loading = null;
        }
    }
}