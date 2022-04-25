import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ChartSettingsService } from './services/settings/chart-settings.service';
import { ErrorService } from './services/error.service';
import { MessageService } from './services/message.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.scss',
        './app-dark.component.scss',
        './app-light.component.scss'
    ]
})
export class AppComponent implements OnInit {
    title = 'Cryptocurrency data analysis tool. Click the ? icon to learn more.'; 
    private settingsShown: boolean = false;
    private helpShown: boolean = false;
    private errorMessage: string = ''
    private clearErrorTimer!: number;
    private warningClass!: string;
    private infoMessage: string = ''
    private clearInfoTimer!: number;
    private infoClass!: string;

    constructor(private chartSettingsService: ChartSettingsService,
                private errorService: ErrorService,
                private messageService: MessageService, 
                private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.errorService.getErrorStram().subscribe(
            (errorResponse: string) => {
                this.errorMessage = errorResponse;
                this.setClearErrorTimer(errorResponse);

                this.changeDetectorRef.detectChanges();
                this.clearErrorMessage();
            },
            (error: any) => {
                console.log(error);
            }
        )

        this.messageService.getMessageStram().subscribe(
            (messageResponse: string) => {
                this.infoMessage = messageResponse;
                this.setClearInfoTimer(messageResponse);

                this.changeDetectorRef.detectChanges();
                this.clearInfoMessage();
            },
            (error: any) => {
                console.log(error);
            }
        )
        this.messageService.setMessage("For help, Toggle the ? or use the &#9881; in the Top Right and turn on Help Tooltips");
    }

    private setClearErrorTimer(errorMessage: string) {
        if(errorMessage.length > 100) {
            this.clearErrorTimer = 10200;
            this.warningClass = 'xl';
        } else if(errorMessage.length > 50) {
            this.clearErrorTimer = 4200;
            this.warningClass = 'long';
        } else if(errorMessage.length > 20) {
            this.clearErrorTimer = 2200;
            this.warningClass = 'medium';
        } else {
            this.clearErrorTimer = 1200;
            this.warningClass = 'small';
        }
    }

    private setClearInfoTimer(infoMessage: string) {
        if(infoMessage.length > 100) {
            this.clearInfoTimer = 20200;
            this.infoClass = 'xl';
        } else if(infoMessage.length > 50) {
            this.clearInfoTimer = 8200;
            this.infoClass = 'long';
        } else if(infoMessage.length > 20) {
            this.clearInfoTimer = 4200;
            this.infoClass = 'medium';
        } else {
            this.clearInfoTimer = 2200;
            this.infoClass = 'small';
        }
    }

    private clearErrorMessage() {
        let clearErrorTimeout = setTimeout(() => {
            this.errorMessage = '';
            clearTimeout(clearErrorTimeout);
        }, this.clearErrorTimer);
    }

    private clearInfoMessage() {
        let clearInfoTimeout = setTimeout(() => {
            this.infoMessage = '';
            clearTimeout(clearInfoTimeout);
        }, this.clearInfoTimer);
    }

    private toggleSettingsModal() {
        this.settingsShown = this.settingsShown ? false : true;
    }

    private toggleHelpModal() {
        this.helpShown = this.helpShown ? false : true;
    }
}
