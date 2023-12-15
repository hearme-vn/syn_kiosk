// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// Development environment
export const environment = {

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


}
