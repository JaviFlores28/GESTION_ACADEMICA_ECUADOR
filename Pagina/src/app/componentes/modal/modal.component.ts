import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck, faCircleQuestion, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() contenido!: string;
  @Input() title!: string;
  @Input() type!: string;
  @Input() form!: boolean;
  @Input() color!: string;

  constructor(public activeModal: NgbActiveModal) { }

  saveModal(action: string) {
    this.activeModal.close(action);
  }

  setIcon() {
    let icon = faCircleQuestion;
    if (this.type === 'danger') {
      icon = faCircleXmark;
    }
    if (this.type==='success') {
      icon=faCircleCheck
    }
    return icon;
  }
}
