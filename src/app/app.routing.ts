import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_helpers';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './pages/error/404.component';
import { P500Component } from './pages/error/500.component';
import { LoginComponent } from './pages/login/login.component';
// import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cs/kiosk-invitation',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'cs',
        loadChildren: () => import('./pages/cs/cs.module').then(m => m.CSModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
