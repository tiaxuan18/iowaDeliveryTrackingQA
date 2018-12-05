import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

import * as ServiceSettings from './config';

@Injectable()
export class HelperService {
	refreshURL: any;

	constructor(public storage: Storage,
				private httpService: Http) {
    	this.refreshURL = ServiceSettings.SERVER_URL + '/api/refresh';
     	
    }

 	formatDate(passedDate){
    	return passedDate.toISOString();
    	//.slice(0, 19).replace('T', ' ');
  	}

  	addDateSeconds(passedDate, duration){
  		passedDate.setSeconds(passedDate.getSeconds() + duration);
    	return passedDate.toISOString();
    	//.slice(0, 19).replace('T', ' ');
  	}

  	getTokenHeader(){
  		return new Promise( (resolve, reject) => {
  			this.storage.get('token').then((token) =>{
  				if (token) {
  					let url = this.refreshURL + '/' + token.userid;

  					this.httpService.get(url).subscribe(
  						data => {
	  						let resp = data.json();
					        let headerDict = {
							  'Content-Type': 'application/json',
							  'x-access-token' : resp.token
							}
							token.token = resp.token;
							this.storage.set('token', token);
				    		resolve({headers: headerDict});
		    			},
		    			error => {
		    			            debugger;
				    	 reject(error);
				  	});
			    } else {
			        reject('No Token exists');
			    }

		    	
	    	});
    	});
   	}
 }