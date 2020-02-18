import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  isLoggedIn;
  currentUser;
  userEmail: string;
  userPassword: string;

  @Input() childMessage: string;

  constructor(private http: HttpClient,
              private router: Router) { }

  ngOnInit() {
    if (!!sessionStorage.getItem("token")) {
      this.router.navigate(['/']);
    }
  }

  logIn(): Observable<any> {
    const params = new HttpParams()
      .set('email', this.userEmail)
      .set('password', this.userPassword);

    this.http.post(`${environment.apiUrl}/auth/sign_in`, params, { observe: 'response' })
      .subscribe(res => {
        if (res && res["body"]) {
          this.currentUser = res["body"]["data"];
          this.storeUserData(res["headers"], res["body"]["data"]["is_admin"]);
          this.isLoggedIn = true;
          this.router.navigate(['/']);
        }
      })

    return;
  }

  // TODO: Use mixin
  storeUserData(responseHeaders, isAdmin) {
    const token = responseHeaders.get("access-token");
    const client = responseHeaders.get("client");
    const uid = responseHeaders.get("uid");
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('client', client);
    sessionStorage.setItem('uid', uid);
    sessionStorage.setItem('isAdmin', isAdmin);
  }
}
