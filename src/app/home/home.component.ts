import { Component, OnInit } from '@angular/core';
import { ClipsListComponent } from '../clips-list/clips-list.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: [],
    standalone: true,
    imports: [ClipsListComponent],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
