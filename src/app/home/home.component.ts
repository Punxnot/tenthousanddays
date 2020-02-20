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
  ageQuery: string;
  currentEventDescription: string;
  currentEventTitle: string;
  ageDescription: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  secondsCounter;
  minutesCounter;
  hoursCounter;

  loading = false;
  wikiImage: string;
  wikiText: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  searchAge() {
    this.loading = true;
    this.ageDescription = "";
    this.currentEventDescription = "";
    this.currentEventTitle = "";
    this.wikiText = "";
    this.wikiImage = "";

    let params = new HttpParams().set("query", this.ageQuery);

    this.http.get(`${environment.apiUrl}/search/age`, {params: params})
      .subscribe(res => {
        if (res) {
          if (res["events"] && res["events"]["length"]) {
            this.ageDescription = res["age_description"];
            this.currentEventDescription = res["events"][0]["description"];
            this.currentEventTitle = res["events"][0]["title"];

            if (res["wiki"]) {
              this.wikiText = res["wiki"]["text"];
              this.wikiImage = res["wiki"]["image"];
            }
          }

          this.days = res["age_numbers"]["days"];
          this.hours = res["age_numbers"]["hours"];
          this.minutes = res["age_numbers"]["minutes"];
          this.seconds = res["age_numbers"]["seconds"];

          this.initCounters();
        }

        this.loading = false;
      })
  }

  initCounters() {
    if (this.secondsCounter) {
      clearInterval(this.secondsCounter);
    }

    if (this.minutesCounter) {
      clearInterval(this.minutesCounter);
    }

    if (this.hoursCounter) {
      clearInterval(this.hoursCounter);
    }

    this.secondsCounter = setInterval(() => {
      this.seconds++;
    }, 1000);

    this.minutesCounter = setInterval(() => {
      this.minutes++;
    }, 60000);

    this.hoursCounter = setInterval(() => {
      this.hours++;
    }, 3600000);
  }

}
