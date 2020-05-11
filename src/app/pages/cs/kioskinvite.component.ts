import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { interval } from 'rxjs';

import { environment }  from 'environments/environment';

import { BaseComponent } from 'app/_bases';
import { APIService, URIS, APPCONSTS, Utils } from 'app/_services';
import { datepickerAnimation } from 'ngx-bootstrap/datepicker/datepicker-animations';

@Component({
  templateUrl: 'kioskinvite.component.html'
})
export class KioskInviteComponent extends BaseComponent implements OnInit {
  public device_list: [];
  public current_device: any;
  public invitation_list = [];
  private wait_time = environment.customer_wait_fb * 1000;

  public invitationForm: FormGroup;
  private status_checker_schedule: any;

  constructor(
    apis_service: APIService,
    private formBuilder: FormBuilder,
    ) {
    super(apis_service);

    this.invitationForm = this.formBuilder.group({
      patient_id: ['', Validators.required],
      patient_name: [''],
      device_index: [-1]
    });

    const scheduler = interval(APPCONSTS.INVITATION_CHECKING_INTERVAL);
    this.status_checker_schedule = scheduler.subscribe(val => this.cancelable_checking());
  }

  // convenience getter for easy access to form fields
  get f() { return this.invitationForm.controls; }

  loadPage() {

    // Load device list
    let device_list_url = this.apis_service.Based_URLs.main + URIS.main.device_list;
    let payload = {status: APPCONSTS.DEVICE_STATUS_ACTIVE, type: APPCONSTS.DEVICE_TYPE_KIOSK};
    let org_id = this.apis_service.getWorkingOrg_Id();
    if (org_id)   payload["org_id"] = org_id;

    this.apis_service.postAPI(device_list_url, payload, function(res) {
        this.device_list = res;
        // console.log("return devices:", res);
      }.bind(this));

    // Load invitation list
    let invitation_list = Utils.getLocalStorage(APPCONSTS.INVITATION_LIST_KEY);
    if (invitation_list) {
      this.invitation_list = invitation_list;
      this.cancelable_checking();
    }
  }

  ngOnDestroy() {
    if (this.status_checker_schedule)   this.status_checker_schedule.unsubscribe();
  }

  onSubmit() {
    console.log("Patient id: %s, device id: %s", 
      this.invitationForm.controls.patient_id.value,
      this.invitationForm.controls.device_index.value
      );
    if (!this.invitationForm.controls.patient_id.value)      return;

    let device = this.device_list[this.invitationForm.controls.device_index.value];
    if (!device)    return;

    let name = this.invitationForm.controls.patient_name.value;
    if (!name)  name = this.invitationForm.controls.patient_id.value;
    
    let payload = {
      "device_id": device["id"],
      "customer": {
        "name": name,
        "ext_id": this.invitationForm.controls.patient_id.value
      }
    }
    let customer_syn_url = this.apis_service.Based_URLs.main + URIS.main.synchronize_customer;
    this.apis_service.postAPI(customer_syn_url, payload, function(res) {
      console.log("return devices:", res);
      let invitation = {
        device: {
          id: device["id"],
          name: device["name"],
        },
        customer: {
          id: this.invitationForm.controls.patient_id.value,
          name: name
        },
        created: new Date(),
        status: APPCONSTS.INVITATION_STATUS_SENT
      };
      this.insertInvitation(invitation);
      this.cancelable_checking();
      Utils.setLocalStorage(APPCONSTS.INVITATION_LIST_KEY, this.invitation_list);

      // Clear form data
      this.invitationForm.patchValue({
        patient_id: '',
        patient_name: ''
      });
  
    }.bind(this));
  }

  // Check and insert new invitation into list
  insertInvitation(invitation) {
    // Pruning list, to keep limit
    if (this.invitation_list.length == APPCONSTS.INVITATION_LIST_LIMIT) {
      this.invitation_list.pop();
    }
    this.invitation_list.unshift(invitation);
  }

  // Check which invitation can be canceled. This method can be run periodically
  // Each kiosk, only last invitation within waiting time can be canceled
  cancelable_checking() {
    let checked_devices = [];

    this.invitation_list.forEach(inv => {
      if (checked_devices.indexOf(inv.device.id) >= 0) {
        inv.cancelable = false;
        return false;
      }
      checked_devices.push(inv.device.id);

      if (inv.status != APPCONSTS.INVITATION_STATUS_SENT) {
        inv.cancelable = false;
        return false;
      }

      if (new Date().getTime() - inv.created.getTime() < this.wait_time) {
        inv.cancelable = true;
      } else {
        inv.cancelable = false;
      }
    });

  }

  // Reset customer synchronization
  reset_customer(invitation) {
    console.log("Customer id: ", invitation.customer.id);

    let payload = {
      obj_id:  invitation.device.id,
      event: "reset_customer"
    }
    let emit_event_url = this.apis_service.Based_URLs.main + URIS.main.object_emit_event;
    this.apis_service.postAPI(emit_event_url, payload, function(res) {
      console.log("return emit:", res);
      invitation.status = APPCONSTS.INVITATION_STATUS_CANCELED;
      invitation.cancelable = false;
      Utils.setLocalStorage(APPCONSTS.INVITATION_LIST_KEY, this.invitation_list);

    }.bind(this));

  }

  // Reset customer synchronization
  reset_feedback() {
    console.log("Reset feedback device: ", this.invitationForm.controls.device_index.value);
    let device = this.device_list[this.invitationForm.controls.device_index.value];
    if (!device)    return;

    let payload = {
      obj_id:  device["id"],
      event: "reset_feedback"
    }
    let emit_event_url = this.apis_service.Based_URLs.main + URIS.main.object_emit_event;
    this.apis_service.postAPI(emit_event_url, payload, function(res) {
      console.log("Finish reset with status:", res);

      // Re-set cancelable status
      if (this.invitation_list && this.invitation_list.length) {
        let inv = this.invitation_list[0];
        if (inv.device.id==device["id"] && inv.cancelable) {
          inv.status = APPCONSTS.INVITATION_STATUS_CANCELED;
          inv.cancelable = false;
          Utils.setLocalStorage(APPCONSTS.INVITATION_LIST_KEY, this.invitation_list);
        }
      }

    }.bind(this));

  }

}
