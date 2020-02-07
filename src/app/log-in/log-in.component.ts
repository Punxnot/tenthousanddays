import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

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
      .set('email', 'user@example.com')
      .set('password', 'qweqwe');

    this.http.post('http://localhost:3000/auth/sign_in', params, { observe: 'response' })
      .subscribe(res => {
        console.log(res);
        this.currentUser = res.body.data;
        this.storeUserData(res.headers);
        this.isLoggedIn = true;
        this.router.navigate(['/']);
      })
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
