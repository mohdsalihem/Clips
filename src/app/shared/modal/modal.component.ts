import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styles: [],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = '';
  constructor(private modal: ModalService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.modal.closeModal();
  }

  isModalOpen(): boolean {
    return this.modal.isModalOpen();
  }

  toggleModal() {
    this.modal.toggleModal();
  }
}
