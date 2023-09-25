import { Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styles: [],
    standalone: true,
    imports: [NgClass],
})
export class TabComponent implements OnInit {
  @Input() tabTitle = '';
  @Input() active = false;
  constructor() {}

  ngOnInit(): void {}
}
