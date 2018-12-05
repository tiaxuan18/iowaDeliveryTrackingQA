import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { HelperService } from './helper';
import * as ServiceSettings from './config';


@Injectable()
export class OpportunityService {
	opportunityURL:any;

    constructor(private httpService: Http,
                private helper: HelperService) {
    	this.opportunityURL = ServiceSettings.SERVER_URL + '/api/opportunity/';
    }

    getTransfers(employer) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.httpService.get(this.opportunityURL + 'transfers/' + employer, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }

    getItineraries(userId) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.httpService.get(this.opportunityURL + 'itineraries/' + userId, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }

    getInTransit(userId) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.httpService.get(this.opportunityURL + 'intransit/' + userId, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }
    
    updateOpportunity(oppoId, jsonBody) {
        return new Promise( (resolve, reject) => {
            this.helper.getTokenHeader().then(header => {
                this.httpService.post(this.opportunityURL + oppoId, jsonBody, header)
                .subscribe(
                    data => {resolve(data.json())},
                    err => { 
                        reject(err);
                    }
                );
            });
        });
    }

}
