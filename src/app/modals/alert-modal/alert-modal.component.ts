import { Component, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';

@Component({
    selector: 'app-alert-modal',
    templateUrl: './alert-modal.component.html',
    styleUrls: [
        './alert-modal.component.scss'
    ],
host: {
    '(document:keydown.enter)': 'dismissModal()',
    },
})

export class AlertModalComponent {
    @Input()
    messageHeader!: string;
    @Input()
    messageText!: string;
    @Input()
    messageButtonText!: string;
    @Input()
    isShown!: boolean;

    @Output() onModalDismissed: EventEmitter<string> = new EventEmitter();


    constructor(private chartSettingsService: ChartSettingsService) {}

    private dismissModal() {
        this.onModalDismissed.emit();
    }

}
