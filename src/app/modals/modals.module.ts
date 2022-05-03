import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { HelpModalComponent } from './help-modal/help-modal.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    AlertModalComponent,
    HelpModalComponent,
    SettingsModalComponent
  ],
  imports: [
    CommonModule,
    PipesModule
  ],
  exports: [
    AlertModalComponent,
    HelpModalComponent,
    SettingsModalComponent
  ]
})
export class ModalsModule { }
