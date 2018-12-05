import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import * as ServiceSettings from './config';

@Injectable()
export class EmployeeService {
	employeeURL:any;
	headers : any;
    user: any;

    constructor(private httpService: Http,
                private storage: Storage) {
    	this.employeeURL = ServiceSettings.SERVER_URL + '/api/employee';
    }

    findByEmail(email, password) {
        return new Promise( (resolve, reject) => {
            let body = {
                email : email,
                password : btoa(password)
            }
            this.httpService.post(this.employeeURL, body)
            .subscribe(
                data => {
                    let resp = data.json();
                    this.storage.set('token', {userid: resp.data.Id, token: resp.token});
                    resolve(data.json())
                },
                err => { 
                    reject(err);
                }
            );
        });
    }

    resetPassword(email) {
        return new Promise( (resolve, reject) => {
            let body = {
                email : email
            }
            this.httpService.post(this.employeeURL + '/resetpassword', body)
            .subscribe(
                data => {resolve(data.json())},
                err => { 
                    reject(err);
                }
            );
        });
    }

}
