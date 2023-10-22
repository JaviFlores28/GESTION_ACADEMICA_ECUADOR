import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input()
  contenido!: string;
  constructor(public activeModal: NgbActiveModal) {}

  closeModal(action: string) {
    this.activeModal.close(action);
  }
}
