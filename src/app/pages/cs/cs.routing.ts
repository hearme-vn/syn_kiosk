import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KioskInviteComponent } from './kioskinvite.component';

const routes: Routes = [
  {
    path: 'kiosk-invitation',
    component: KioskInviteComponent,
    data: {
      title: 'Invite customer at Kiosk'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CSRouting {}

