import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  wikiQuery: string;
  ageQuery: string;
  searchResult: string;
  searchImage: string;
  searchItemsLoading = false;
  currentEventTitle: string;
  currentEventDescription: string;
  ageDescription: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  searchItems() {
    this.searchItemsLoading = true;
    let params = new HttpParams().set("query", this.wikiQuery);

    this.http.get(`${environment.apiUrl}/search/items`, {params: params})
      .subscribe(res => {
        this.searchResult = res["text"];
        this.searchImage = res["image"];
        this.searchItemsLoading = false;
      })
  }

  searchAge() {
    let params = new HttpParams().set("query", this.ageQuery);

    this.http.get(`${environment.apiUrl}/search/age`, {params: params})
      .subscribe(res => {
        if (res) {
          if (res["age_description"] && res["events"] && res["events"]["length"]) {
            this.ageDescription = res["age_description"];
            this.currentEventTitle = res["events"][0]["title"];
            this.currentEventDescription = res["events"][0]["description"];
          } else {
            this.days = res["age_numbers"]["days"];
            this.hours = res["age_numbers"]["hours"];
            this.minutes = res["age_numbers"]["minutes"];
            this.seconds = res["age_numbers"]["seconds"];

            this.initCounters();
          }
        }
      })
  }

  initCounters() {
    setInterval(() => {
      this.seconds++;
    }, 1000);

    setInterval(() => {
      this.minutes++;
    }, 60000);

    setInterval(() => {
      this.hours++;
    }, 3600000);
  }

}
