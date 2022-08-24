import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styles: [],
})
export class InputComponent implements OnInit {
  @Input() control: FormControl = new FormControl();
  @Input() type = '';
  @Input() placeholder = '';
  @Input() fieldName = 'Field';
  @Input() maskFormat = '';

  constructor() {}

  ngOnInit(): void {}
}
