import { map } from 'rxjs/operators';

import { User } from '../_models';
import { APIService, APPCONSTS } from 'app/_services';

//import { environment }  from '../../environments/environment';

export class BaseComponent {
  public apis_service;
  private APPCONSTS = APPCONSTS;


  constructor( apis_service: APIService) {
    this.apis_service = apis_service;
  }


  loadPage() {}

  ngOnInit() {
    console.log("Initialed view");

    // Load data here
    this.loadPage();
  }
  
}