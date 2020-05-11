//

export const APPCONSTS = {
  // For general purpose
  "WORKING_ORG_ID": "working_org_id",

  // For Device status
  DEVICE_STATUS_NEW: 0,
  DEVICE_STATUS_ACTIVE: 1,
  DEVICE_STATUS_INACTIVE: 2,

  // For Device type
  DEVICE_TYPE_KIOSK: 0,
  DEVICE_TYPE_WEB: 1,
  DEVICE_TYPE_EMAIL: 2,
  
  // For Organization
  ORGANIZATION_TYPE_PERSONAL: 0,
  ORGANIZATION_TYPE_ENTERPRISE: 1,

  // For local storage keys
  AUTH_TOKEN: "hearme_token",
  INVITATION_LIST_KEY: "invitation_list_key",

  // For invitation customer in Kiosk
  INVITATION_STATUS_SENT: 0,
  INVITATION_STATUS_CANCELED: 1,
  INVITATION_LIST_LIMIT: 5,           // Number of invitation kept in list
  INVITATION_CHECKING_INTERVAL: 3000    //Interval of time that checking invitation if they are cancelable

}