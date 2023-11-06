import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
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
