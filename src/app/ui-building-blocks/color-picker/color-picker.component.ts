import { Component, forwardRef, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: 'app/components/color-picker/color-picker.component.html',
    styleUrls: [
        'app/components/color-picker/color-picker.component.scss'
    ],
    providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ColorPickerComponent),
        multi: true
    }
    ],
    host: {
    '(document:click)': 'onOutsideClick($event)',
    },
})
export class ColorPickerComponent implements ControlValueAccessor  {
    private paletteHidden: boolean = true;
    private selectedColor!: string;
    propagateChange = (color: string) => {};
    private colors: Object = {
        blues: [
            'blue',
            'steelblue',
            'dodgerblue',
            'deepskyblue',
            'cadetblue',
            'cyan'
        ],
        greens: [
            'green',
            'mediumseagreen',
            'limegreen',
            'lime',
            'lawngreen',
            'yellowgreen'
        ],
        yellows: [
            'yellow',
            'gold',
            'goldenrod',
            'orange',
            '#ff6600',
            'orangered'
        ],
        reds: [
            'red',
            'crimson',
            'firebrick',
            'maroon',
            '#990033',
            'mediumvioletred'
        ],
        magentas: [
            'deeppink',
            'fuchsia',
            'orchid',
            'purple',
            'darkorchid',
            'mediumpurple'
        ],
        grays: [
            'black',
            'dimgray',
            'gray',
            'darkgray',
            'lightgray',
            'white'
        ]
    };


    constructor(private elementRef: ElementRef, private chartSettingsService: ChartSettingsService) {}

    private togglePalette() {
        this.paletteHidden = this.paletteHidden ? false : true;
    }

    private onOutsideClick(event: any) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hidePalette();
        }
    }
    private hidePalette() {
        this.paletteHidden = true;
    }

    private selectColor(color: string) {
        this.writeValue(color);
        this.hidePalette();
    }

    /**
     * ControlValueAccessor interface methods
     */

    writeValue(color: string) {
        this.selectedColor = color;
        this.propagateChange(this.selectedColor);
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {}

}
