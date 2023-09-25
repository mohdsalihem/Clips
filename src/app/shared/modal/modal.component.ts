import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styles: [],
  standalone: true,
  imports: [NgClass],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = '';
  modalService = inject(ModalService);

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.modalService.closeModal();
  }

  isModalOpen(): boolean {
    return this.modalService.isModalOpen();
  }

  toggleModal() {
    this.modalService.toggleModal();
  }
}
