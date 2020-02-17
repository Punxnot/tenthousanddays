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
  title = 'Narkom';
  currentUser = {};
  userEmail: string;
  userPassword: string;
  loading = false;
  wikiQuery: string;
  ageQuery: string;
  searchResult: string;
  currentEventTitle: string;
  currentEventDescription: string;
  ageDescription: string;
  searchImage: string;

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
      });
  }

  validateToken(): Observable<any> {
    console.log(environment.apiUrl);
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
            this.currentUser = res["body"]["data"];
            this.storeUserData(res["headers"]);
          }
          this.loading = false;
        })
    }
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

  isLoggedIn() {
    return !!sessionStorage.getItem("token");
  }

  searchItems() {
    let params = new HttpParams().set("query", this.wikiQuery);

    this.http.get(`${environment.apiUrl}/search/items`, {params: params})
      .subscribe(res => {
        this.searchResult = res["text"];
        this.searchImage = res["image"];
      })
  }

  searchAge() {
    let params = new HttpParams().set("query", this.ageQuery);

    this.http.get(`${environment.apiUrl}/search/age`, {params: params})
      .subscribe(res => {
        if (res) {
          this.ageDescription = res["age_description"];
          if (res["events"] && res["events"]["length"]) {
            this.currentEventTitle = res["events"][0]["title"];
            this.currentEventDescription = res["events"][0]["description"];
          }
        }
      })
  }

  initDateField() {
    const minAge = 18;
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - minAge);
    let dd = maxDate.getDate();
    let mm = maxDate.getMonth()+1;
    let yyyy = maxDate.getFullYear();
    let ddString = dd.toString();
    let mmString = mm.toString();
    let yyyyString = yyyy.toString();
    let maxDateString = "";

    if (dd < 10) {
      ddString = '0' + ddString;
    }

    if (mm < 10) {
      mmString = '0' + mmString;
    }

    maxDateString = yyyyString + '-' + mmString + '-' + ddString;
    document.getElementById("birth-date").setAttribute("max", maxDateString);
  }
}
