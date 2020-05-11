import {Component } from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from 'app/_nav';

import { AuthenticationService } from 'app/_services/authentication.service';
import { APIService, URIS, APPCONSTS } from 'app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  private role_list = [];
  private current_org_id = null;
  public logo_url = "assets/img/brand/aih.png";

  constructor( 
    private router: Router,
    private authenticationService: AuthenticationService,
    private apis_service: APIService
    ) { 

    this.loadAppData();
  }

  // Load necessary application data here
  loadAppData() {
    let isAuthenticated = this.authenticationService.isAuthenicated();
    if (!isAuthenticated)   return;

    // Load Organization and user  role list
    let rolelist_url =  this.apis_service.Based_URLs.main + URIS.main.v145RoleList;
    this.apis_service.getAPI(rolelist_url, function(res) {
      this.role_list = res;
      // console.log("return organization list:", res);
      this.getPersonalOrganization();
    }.bind(this));

  }

  // Get Personal organization and add to organization list  
  getPersonalOrganization() {
    // Load personal organoization
    this.getOrganizationById(null, function(res) {
      // this.rol = res;
      let root_role = { org_id: res.id, organization: res, roles: null };
      this.role_list.unshift(root_role);
      this.getCurrentOrganization();
    }.bind(this));
  }

  // Get current working organozation
  getCurrentOrganization() {
    // Load working enterprise by org_id
    let org_id = localStorage.getItem( APPCONSTS.WORKING_ORG_ID );
    if (org_id)
      this.getOrganizationById(org_id, function(res) {
        this.logo_url = this.apis_service.Based_URLs.imgs + res.logo;
        this.apis_service.working_org = res;
      }.bind(this))
    else 
      this.apis_service.working_org = this.role_list[0].organization;
    // this.current_org_id = this.apis_service.working_org.id;
  }

  // Get current organization
  getOrganizationById(org_id, callback = null) {
    let url = this.apis_service.Based_URLs.main + URIS.main.organization_info;

    let payload = { org_id: org_id }
    this.apis_service.postAPI(url, payload, function(res) {
      // console.log("Organization Info:", res);
      if (callback)   callback(res);
    }.bind(this));

  }

  // Support change organization
  changeOrganization(org) {
    console.log("selected organization: ", org.id);
    let current_org_id = this.apis_service.getWorkingOrg_Id();
    if (current_org_id == org.id)   return;

    let org_id = "";
    if (org.type == APPCONSTS.ORGANIZATION_TYPE_ENTERPRISE)   org_id = org.id;
    localStorage.setItem( APPCONSTS.WORKING_ORG_ID, org_id);
    location.reload();
    return false;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    return false;
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
}
