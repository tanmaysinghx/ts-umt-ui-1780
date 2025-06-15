/* This file can be replaced during build by using the `fileReplacements` array.
`ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
 The list of file replacements can be found in `angular.json`. */

 export const environment = {
    production: false,
    cmsUrl: 'http://localhost:1780/',
    ssoService: 'http://localhost:1605/1625/auth-service/v2/api',
    umtService: 'http://localhost:1605/1689/notification-service',
    apiGatewayService: 'https://ts-api-gateway-service-1605-z7txd.ondigitalocean.app/',
    ssoProdService: 'https://octopus-app-xmsre.ondigitalocean.app/v2/api/'
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  /* import 'zone.js/dist/zone-error';  Included with Angular CLI. */
  