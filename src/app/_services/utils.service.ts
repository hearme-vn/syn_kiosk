// import { Injectable } from '@angular/core';

import { environment }  from 'environments/environment';
import { APPCONSTS } from './app.const';

export class Utils {
  public Based_URLs: any;
  public fbClientID: string;

  public working_org: any;    // Current organization that user is working on

  constructor() {
    this.Based_URLs = environment.URLs;
  }

  static dateParser (key, value) {
    var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

      if (typeof value === 'string') {
          var a = reISO.exec(value);
          if (a)
              return new Date(value);
          a = reMsAjax.exec(value);
          if (a) {
              var b = a[1].split(/[-+,.]/);
              return new Date(b[0] ? +b[0] : 0 - +b[1]);
          }
      }
      return value;
  };


  // store object in local storage
  static setLocalStorage(key, object) {
    if (!key || !object) {
      console.log("Missing data to store");
      return;
    } 

    let data = JSON.stringify(object);
    localStorage.setItem(key, data);
  }

  // get data from localstorage for parse to JSON object
  static getLocalStorage(key) {
    let data = localStorage.getItem(key);
    let object = null;
    if (data)   object = JSON.parse(data, Utils.dateParser);

    return object;
  }

}