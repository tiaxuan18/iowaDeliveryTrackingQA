import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

import { HelperService } from './helper';

import * as ServiceSettings from './config';

@Injectable()
export class TransferGPSService {
	transferGPSURL:any;
    interval: any;
    gpsData : any;

    constructor(private httpService: Http,
                private storage: Storage,
                private helper: HelperService,
                private geolocation: Geolocation) {
    	this.transferGPSURL = ServiceSettings.SERVER_URL + '/api/transfergps';
    	
    }


    createTransferGPS(jsonBody) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.httpService.post(this.transferGPSURL, jsonBody, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }


    startGPSTracking() {
        this.trackGPS();
        this.interval = setInterval(() => {
            this.trackGPS();
        }, ServiceSettings.TRACK_INTERVAL);
        this.storage.set('intervalID', this.interval);
        
    }

    trackGPS() {
        this.storage.get('user').then((user) => {
            this.storage.get('gpsData').then((gps) => {
                this.geolocation.getCurrentPosition().then((resp) => {
                    if (gps == null){
                        gps = [];
                    }
                    gps.push(resp.coords.latitude);
                    gps.push(resp.coords.longitude);
                    gps.push(user.Id);
                    gps.push(this.helper.formatDate(new Date()));
                    this.storage.set('gpsData', gps);
                });
            });
        });
        
    }

    stopGPSTracking() {
        return new Promise( (resolve, reject) => {
             this.storage.get('intervalID').then((iId) => {
                clearInterval(iId);
                 this.storage.get('gpsData').then((gps) => {
                    if (gps != null && gps.length > 0){
                        var body = { colNames : ['Latitude__c', 'Longitude__c', 'Driver__c', 'Log_Create_Date__c'],
                                     vals : gps};
                        this.createTransferGPS(body)
                            .then( data => {
                                this.storage.remove('gpsData');
                                resolve(data);})
                            .catch( err => {
                                reject(err);
                            });
                    } else {
                        resolve();
                    }
                 });
             });
         });
    }

   

}
