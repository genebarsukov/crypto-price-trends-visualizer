import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ErrorService {
    private errorSubs = new Subject<any>();
    private errorStream = this.errorSubs.asObservable();
    private errorMesage: string = '';


    constructor() {}

    /**
     * Get an observable to substribe to and get notified when new data comes in
     */
    public getErrorStram() {
        return this.errorStream;
    }

    /**
     * Notify subscribers when a new error message is received
     * @param errorMesage New error message received from the class that encountered the error
     */
    private notifySubs(errorMesage: string) {
        this.errorSubs.next(errorMesage);
    }

    /**
     * Receive a new error message and notify subscribers
     * @param errorMesage New error message received from the class that encountered the error
     */
    public setErrorMessage(errorMesage: string) {
        this.errorMesage = errorMesage;
        this.notifySubs(errorMesage);
    }
}