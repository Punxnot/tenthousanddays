import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '10000 дней';
  nickname = "";
  loading = false;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.validateToken();
  }

  // ngAfterViewInit() {
  //   this.initDateField();
  // }

  logOut() {
    const headers = new HttpHeaders({
      'access-token': sessionStorage.getItem("token"),
      'client': sessionStorage.getItem("client"),
      'uid': sessionStorage.getItem("uid")
    });

    this.http.delete(`${environment.apiUrl}/auth/sign_out`, {headers: headers})
      .subscribe(res => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("client");
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("isAdmin");
      });
  }

  validateToken(): Observable<any> {
    if (!!sessionStorage.getItem("token")) {
      this.loading = true;

      const headers = new HttpHeaders({
        'access-token': sessionStorage.getItem("token"),
        'client': sessionStorage.getItem("client"),
        'uid': sessionStorage.getItem("uid")
      });

      this.http.get(`${environment.apiUrl}/auth/validate_token`, {headers: headers, observe: 'response'})
        .subscribe(res => {
          if (res && res["body"]) {
            this.nickname = res["body"]["data"]["nickname"];
            this.storeUserData(res["headers"], res["body"]["data"]["is_admin"]);
          }
          this.loading = false;
        })
    }
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

  isLoggedIn() {
    return !!sessionStorage.getItem("token");
  }
}
