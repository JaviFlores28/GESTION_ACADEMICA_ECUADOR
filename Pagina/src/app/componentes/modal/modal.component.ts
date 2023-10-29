import { Component, Input } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input()
  contenido: string = '';
  @Input()
  color: string = 'info';
  @Input()
  icon: IconProp = faCircleExclamation;
  @Input()
  modal: boolean = true;

  constructor(public activeModal: NgbActiveModal) {
  }

  saveModal(action: string) {
    this.activeModal.close(action);
  }
}
