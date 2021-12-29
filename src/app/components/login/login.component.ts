import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

// @ts-ignore
import * as OktaSignIn from '@okta/okta-signin-widget';

import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: OktaSignIn;

  constructor(private authStateService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { 

    this.oktaSignin = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an OIDC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      features: {
        registration: true
      },
      redirectUri: myAppConfig.oidc.redirectUri,
      logo: 'assets/images/logo.png',
      i18n: {
        pl: {
          'primaryauth.title': 'Sign in to Angular & Company',
        },
      },
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      },
      authClient: oktaAuth
    }); 

  }

  ngOnInit(): void {
    this.oktaSignin.remove();
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'
    },
    (response: any) => {
      if (response.status === 'SUCCESS') {
        this.oktaAuth.signInWithRedirect();
      }
    },
    (error: any) => {
      throw error;
    });
  }

}
