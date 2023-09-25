import { Component, OnInit, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styles: [],
    standalone: true,
    imports: [NgClass],
})
export class AlertComponent implements OnInit {
  @Input() color = 'blue';

  get bgColor() {
    switch (this.color) {
      case 'blue':
        return 'bg-blue-400';
      case 'green':
        return 'bg-green-400';
      case 'red':
        return 'bg-red-400';

      default:
        return 'bg-blue-400';
    }
  }
  constructor() {}

  ngOnInit(): void {}
}
