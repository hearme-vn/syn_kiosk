import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';
import { APIService } from './apis.service';
import { APPCONSTS } from './app.const';

import { environment }  from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, apis_service: APIService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public getToken() {
        let token = localStorage.getItem( APPCONSTS.AUTH_TOKEN );
        return token;
    }

    public isAuthenicated() {
        let token = localStorage.getItem( APPCONSTS.AUTH_TOKEN );
        return token;
    }

    login(username: string, password: string) {
        let payload = { "username": username, "password": password };
        return this.http.post<any>(environment.URLs.auth + `/auth/login`, payload).toPromise()
            .then(function(res) {
                console.log("Token: ", res);
                localStorage.setItem( APPCONSTS.AUTH_TOKEN, res.token );
            }
        
            );        
            // .pipe(map(user => {
            //     // login successful if there's a jwt token in the response
            //     if (user && user.token) {
            //         // store user details and jwt token in local storage to keep user logged in between page refreshes
            //         localStorage.setItem('currentUser', JSON.stringify(user));
            //         this.currentUserSubject.next(user);
            //     }

            //     return user;
            // }));
    }

    // This method check if current user has roles, return true; otherwise return false 
    hasRoles(roles) {

        return true;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem( APPCONSTS.AUTH_TOKEN );
        // this.currentUserSubject.next(null);
    }
}