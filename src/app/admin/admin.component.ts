import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
  eventStartDate;
  eventEndDate;
  eventTitle;
  eventDescription;
  isFlashShown = false;
  allRecords;

  constructor(private http: HttpClient,
              private router: Router) { }

  ngOnInit() {
    console.log(sessionStorage.getItem("isAdmin"));
    if (!(sessionStorage.getItem("token") && sessionStorage.getItem("isAdmin"))) {
      this.router.navigate(['/']);
    } else {
      this.http.get(`${environment.apiUrl}/get_all_records`)
        .subscribe(res => {
          this.allRecords = res;
        })
    }
  }

  onSubmit() {
    const date1 = moment(this.eventStartDate, "DD/MM/YYYY");
    const date2 = moment(this.eventEndDate, "DD/MM/YYYY");
    const differenceInDays = date2.diff(date1, 'days');

    const data = {
      "days": differenceInDays,
      "event": {
        "title": this.eventTitle,
        "description": this.eventDescription
      }
    };

    this.http.post(`${environment.apiUrl}/create/event`, data)
      .subscribe(res => {
        this.allRecords = res;
        // this.eventStartDate = null;
        this.eventEndDate = null;
        // this.eventTitle = null;
        this.eventDescription = null;
        this.isFlashShown = true;
        setTimeout(() => {
          this.isFlashShown = false;
        }, 3000);
      })
  }
}
