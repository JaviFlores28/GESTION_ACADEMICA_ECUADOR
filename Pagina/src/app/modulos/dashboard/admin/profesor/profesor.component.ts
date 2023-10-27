import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleCheck, faCircleXmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { getFormattedToday, variables } from 'src/app/modelos/variables/variables';
import { ProfesorService } from 'src/app/servicios/profesor.service';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.scss']
})
export class ProfesorComponent {
  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: ProfesorService) { }

  modoEdicion: boolean = false;
  elementoId: string = '';

  form = this.formBuilder.group({
    dni: ['', Validators.required],
    nom1: ['', Validators.required],
    nom2: ['', Validators.required],
    ape1: ['', Validators.required],
    ape2: ['', Validators.required],
    fecN: [getFormattedToday(), Validators.required],
    gen: ['', Validators.required],
    dir: ['', Validators.required],
    tel: ['', Validators.required],
    cel: ['', Validators.required],
    mail: ['', Validators.required],
    fecI: [getFormattedToday(), Validators.required],
    fecM: [getFormattedToday(), Validators.required],
    estado: [false, Validators.required]
  })

  onSubmit() { }

}