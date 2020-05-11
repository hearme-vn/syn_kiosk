import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KioskInviteComponent } from './kioskinvite.component';
import { CSRouting } from './cs.routing';

@NgModule({
  imports: [
    CSRouting,
    ChartsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule    
  ],
  declarations: [ KioskInviteComponent ]
})
export class CSModule { }

