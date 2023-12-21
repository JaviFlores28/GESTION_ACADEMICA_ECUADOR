import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input()
  contenido: string = '';
  @Input()
  title: string = '';
  @Input()
  type = 'info';
  @Input()
  form: boolean = true;

  color: string = '';

  constructor(public activeModal: NgbActiveModal) { }

  saveModal(action: string) {
    this.activeModal.close(action);
  }

  setIcon() {
    if (this.type === 'success') {
      this.color = 'success';
      return faCircleQuestion;
    } 
    if (this.type === 'info') {
      this.color = 'primary';
      return faCircleQuestion;
    } 
    if (this.type === 'warning') {
      this.color = 'warning'
      return faInfoCircle;
    }
    return faCircleQuestion;
  }
}
