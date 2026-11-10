// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  emailApiUrl: 'https://api.lrn4chg.site/email',
  // Dev signing secret. The production secret must be injected at build time
  // (e.g. git-ignored file replacement) and must NOT be committed.
  apiSecret: '075f9e70a5e8a2a14b13225a6ea422e12c52fb0cc43193c2e3b2d0f72c5ce049'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
