import { Component, Input, Output, forwardRef, ElementRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconSettingsService } from '../../services/settings/icon-settings.service';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';


@Component({
    selector: 'app-text-picker',
    templateUrl: 'app/components/text-picker/text-picker.component.html',
    styleUrls: [
        'app/components/text-picker/text-picker.component.scss',
        'app/components/text-picker/text-picker-light.component.scss',
        'app/components/text-picker/text-picker-dark.component.scss'
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextPickerComponent),
            multi: true
        }
    ],
    host: {
        '(document:click)': 'onOutsideClick($event)',
    },
})
export class TextPickerComponent implements ControlValueAccessor  {
    private listHidden: boolean = true;
    private selectedItem: any;
    propagateChange = (text: string) => {};
    @Input() iconSize: string = 'small';
    @Output() disabledCheck = new EventEmitter();
    @Input() customInputClass: string = '';
    @Input() customListClass: string = '';
    @Input() customItemClass: string = '';
    @Input()
    items!: any[];


    constructor(private elementRef: ElementRef, 
                private iconSettingsService: IconSettingsService,
                private chartSettingsService: ChartSettingsService) {}

    private toggleList() {
        if (this.items.length) {
            this.listHidden = this.listHidden ? false : true;
        }
        if (!this.listHidden) {
            this.disabledCheck.emit();
        }
    }

    private onOutsideClick(event: any) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hideList();
        }
    }
    private hideList() {
        this.listHidden = true;
    }

    private selectItem(item: any) {
        if(!item.disabled) {
            this.writeValue(item.value);
            this.hideList();
        }
    }

    /**
     * ControlValueAccessor interface methods
     */

    writeValue(value: string) {
        // This iteration is done so that our selectedItem always reflects the last value that was changed
        // The selectedItem can be an object whereas the writeValue is propagated as text
        for (let item of this.items) {
            if (item.value == value) {
                this.selectedItem = item;
                break;
            }
        }
        this.propagateChange(value);
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {}

}
