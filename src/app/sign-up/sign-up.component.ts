import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  isLoggedIn;
  currentUser;
  userName: string;
  userNickname: string;
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

  signUp(): Observable<any> {
    const params = new HttpParams()
      .set('name', this.userName)
      .set('nickname', this.userNickname)
      .set('email', this.userEmail)
      .set('password', this.userPassword);

    this.http.post(`${environment.apiUrl}/auth`, params, { observe: 'response' })
      .subscribe(res => {
        if (res && res["body"]) {
          this.currentUser = res["body"]["data"];
          this.storeUserData(res["headers"]);
          this.isLoggedIn = true;
          this.router.navigate(['/']);
        }
      })

    return;
  }

  // TODO: Use mixin
  storeUserData(responseHeaders) {
    const token = responseHeaders.get("access-token");
    const client = responseHeaders.get("client");
    const uid = responseHeaders.get("uid");
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('client', client);
    sessionStorage.setItem('uid', uid);
  }
}
