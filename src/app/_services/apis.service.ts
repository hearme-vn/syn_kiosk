import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// import { User } from '../_models';
import { environment }  from 'environments/environment';
import { APPCONSTS } from './app.const';

@Injectable({ providedIn: 'root' })
export class APIService {
  public Based_URLs: any;
  public fbClientID: string;

  public working_org: any;    // Current organization that user is working on

  constructor(private http: HttpClient) {
    this.Based_URLs = environment.URLs;
    this.apiURL_config(environment.root);
  }

  // Set new api based on root URL
  apiURL_config(root) {
    if (!root)      return;
    
    this.Based_URLs.main = 		root + "/main/";
    this.Based_URLs.auth = 	root + "/oauth/";
    this.Based_URLs.front = 	root + "/front/";
    this.Based_URLs.imgs = 	root + "/img/";
    this.Based_URLs.socket = 	{
      root: root,
      path: "/comm/socket.io",
      api: root + "/comm"
    };
  }

  // Assign new value
  app_reconfig(key, value) {
    this[key] = value;
  }

  showNoty(message, type) {
    var position = 'topRight';
    // noty({
    //   theme: 'app-noty',
    //   text: message,
    //   type: type,
    //   timeout: 3000,
    //   layout: position,
    //   closeWith: ['button', 'click'],
    //   animation: {
    //     open: 'in',
    //     close: 'out'
    //   },
    // });
  }            

  public getWorkingOrg_Id() {
    let org_id = localStorage.getItem( APPCONSTS.WORKING_ORG_ID);
    return org_id;
  }

  public getAPI(api_url, successCallBack=null, errorCallBack=null) {
    return this.http.get(api_url).toPromise()
      .then(function(res) {
        if (successCallBack)    successCallBack(res);
      }, function(err) {
        if (errorCallBack) {
          errorCallBack(err);
        } else {
          this.handleError(err);
        }
      }.bind(this));
  }

  public postAPI(api_url, data, successCallBack=null, errorCallBack=null, finallyCallBack=null) {
    return this.http.post(api_url, data)
      .subscribe((res) => {
        if (successCallBack)    successCallBack(res);
      }, (err) => {
        if (errorCallBack)      errorCallBack(err);
      }, () => {
        if (finallyCallBack)    finallyCallBack();
      })

    // .then(function successCase(response) {
    //   var data = response.data;
    //   if (data == null) {
    //     console.log("Error in internet connection");
    //   } else {
    //     if (successCallBack)	successCallBack(data);
    //   }
    // }, function(response) {
    //   if (errorCallBack) {
    //     errorCallBack(response);
    //   } else {
    //     // errorCase, Not this.errorCase. This = undefined
    //     this.handleError(response);
    //   }
    // })
  }


}
