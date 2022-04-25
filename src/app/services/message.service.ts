import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class MessageService {
    private messageSubs = new Subject<any>();
    private messageStream = this.messageSubs.asObservable();
    private mesage: string = '';

    constructor() {}

    /**
     * Get an observable to substribe to and get notified when new data comes in
     */
    public getMessageStram() {
        return this.messageStream;
    }

    /**
     * Notify subscribers when a new message is received
     * @param mesage New message received from the class that invoked the message
     */
    private notifySubs(mesage: string) {
        this.messageSubs.next(mesage);
    }

    /**
     * Receive a new message and notify subscribers
     * @param mesage New message received from the class that invoked the message
     */
    public setMessage(mesage: string) {
        this.mesage = mesage;
        this.notifySubs(mesage);
    }
}