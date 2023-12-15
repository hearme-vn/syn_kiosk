export const environment = {
  production: true,

  root: "",
  URLs: {
    main:   "https://api.hearme.vn/main/",
    auth:   "https://api.hearme.vn/oauth/",
    front:  "https://api.hearme.vn/front/",
    imgs:   "https://hearme.vn/img/",
    socket:	{
            root: "https://comm.hearme.vn",
            path: "",
            api: "https://comm.hearme.vn"
    },
    survey_web: "https://cx.hearme.vn",
    public_web:  	"http://topcx.hearme.vn/#",
    appBase:  	"https://hearme.vn/user/",
  },
  fbClientID: 	"321172551672315",

  customer_wait_fb: 120   // Wait customer  for sending feedback; in second
};
