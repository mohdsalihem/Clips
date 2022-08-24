import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styles: [],
})
export class TabComponent implements OnInit {
  @Input() tabTitle = '';
  @Input() active = false;
  constructor() {}

  ngOnInit(): void {}
}
