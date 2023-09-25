import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styles: [],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
})
export class InputComponent implements OnInit {
  @Input() control: FormControl = new FormControl();
  @Input() type = '';
  @Input() placeholder = '';
  @Input() fieldName = 'Field';

  ngOnInit(): void {}
}
