import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private ngBootstrap: NgbModal) { }
  openModal(title: string, message: string, alertType: string, form: boolean) {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({centered: true });
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = message);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.type = alertType;
    modalRef.componentInstance.form = form;
    modalRef.componentInstance.color = alertType;

    return modalRef.result;
  }
}
