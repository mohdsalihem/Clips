import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  visible = signal(false);

  isModalOpen() {
    return this.visible();
  }

  toggleModal() {
    this.visible.set(!this.visible());
  }

  closeModal() {
    this.visible.set(false);
  }
}
