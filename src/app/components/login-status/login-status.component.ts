import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean;
  userFullName: string;
  userEmail: string;
  storage: Storage = sessionStorage;

  constructor(public authStateService: OktaAuthStateService, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth) { }

  async ngOnInit() {
    console.log('LoginStatusComponent ngOnInit')
    this.authStateService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated as boolean;
        this.getUserDetails();
      }
    ); 
  }

  logout() {
    this.oktaAuth.signOut();
  }

  getUserDetails() {
    const userClaims = this.oktaAuth.getUser().then(
      res => {
        this.userFullName = res.name as string;
        this.userEmail = res.email as string;

        this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
      }
    );
  }
}
