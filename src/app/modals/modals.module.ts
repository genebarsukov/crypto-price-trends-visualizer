import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { HelpModalComponent } from './help-modal/help-modal.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';


@NgModule({
  declarations: [
    AlertModalComponent,
    HelpModalComponent,
    SettingsModalComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ModalsModule { }
