import { Component, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';

@Component({
    selector: 'app-help-modal',
    templateUrl: './help-modal.component.html',
    styleUrls: [
        './help-modal.component.scss'
    ]
})

export class HelpModalComponent {
    @Input()
    messageHeader!: string;
    @Input()
    messageText!: string;
    @Input()
    messageButtonText!: string;
    @Input()
    isShown!: boolean;

    @Output() onModalDismissed: EventEmitter<string> = new EventEmitter();

    bullet: string = '&#x27A7;';


    constructor(public chartSettingsService: ChartSettingsService) {}

    dismissModal() {
        this.onModalDismissed.emit();
    }

}
