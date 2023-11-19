import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { faInfoCircle, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private ngBootstrap: NgbModal) {}

  openAlertModal(content: string, alertType: string) {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = content);
    modalRef.componentInstance.icon = (alertType === 'success') ? faCircleCheck : (alertType === 'danger') ? faCircleXmark : faInfoCircle;
    modalRef.componentInstance.color = alertType;
    modalRef.componentInstance.modal = false;
  }

  openConfirmationModal(message: string) {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = message);
    modalRef.componentInstance.icon = faInfoCircle;
    modalRef.componentInstance.color = 'warning';
    return modalRef.result;
  }
}
