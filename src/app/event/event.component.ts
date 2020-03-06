import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() event: Object;
  isEditing = false;
  isFlashShown = false;
  oldTitle: String;
  oldDescription: String;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.oldTitle = this.event.title;
    this.oldDescription = this.event.description;
  }

  editEvent() {
    this.isEditing = true;
  }

  dropChanges() {
    this.event.title = this.oldTitle;
    this.event.description = this.oldDescription;
    this.isEditing = false;
  }

  saveEvent() {
    const data = {
      "id": this.event.id,
      "title": this.event.title,
      "description": this.event.description
    };

    this.http.put(`${environment.apiUrl}/edit/event`, data)
      .subscribe(res => {;
        this.isEditing = false;
        this.isFlashShown = true;
        this.oldTitle = res.title;
        this.oldDescription = res.description;
        setTimeout(() => {
          this.isFlashShown = false;
        }, 3000);
      })
  }
}
