import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clip.model';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';
import { InputComponent } from '../../shared/input/input.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { NgIf, NgClass } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
  styles: [],
  standalone: true,
  imports: [
    ModalComponent,
    NgIf,
    AlertComponent,
    ReactiveFormsModule,
    InputComponent,
    NgClass,
  ],
})
export class VideoEditComponent implements OnInit, OnChanges {
  modalService = inject(ModalService);
  clipService = inject(ClipService);

  @Input() activeClip: IClip | null = null;
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait! Updating clip.';
  inSubmission = false;
  @Output() update = new EventEmitter();

  editForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.editForm.controls.id.setValue(this.activeClip.docID!);
    this.editForm.controls.title.setValue(this.activeClip.title);
  }

  async submit() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Updating clip.';

    try {
      await this.clipService.updateClip(
        this.editForm.controls.id.value,
        this.editForm.controls.title.value,
      );
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMessage = 'Something went wrong. Try again later.';
      return;
    }

    this.activeClip.title = this.editForm.controls.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Success!';
  }
}
