import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styles: [],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgxMaskDirective,
        NgIf,
    ],
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
