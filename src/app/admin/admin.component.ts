import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

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

  constructor(private http: HttpClient,
              private router: Router) { }

  ngOnInit() {
    console.log(sessionStorage.getItem("isAdmin"));
    if (!(sessionStorage.getItem("token") && sessionStorage.getItem("isAdmin"))) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    const date1 = new Date(this.eventStartDate);
    const date2 = new Date(this.eventEndDate);
    const differenceInTime = date2.getTime() - date1.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    const data = {
      "days": differenceInDays,
      "event": {
        "title": this.eventTitle,
        "description": this.eventDescription
      }
    };

    this.http.post(`${environment.apiUrl}/create/event`, data)
      .subscribe(res => {
        this.eventStartDate = null;
        this.eventEndDate = null;
        this.eventTitle = null;
        this.eventDescription = null;
        this.isFlashShown = true;
        setTimeout(() => {
          this.isFlashShown = false;
        }, 3000);
      })
  }
}
