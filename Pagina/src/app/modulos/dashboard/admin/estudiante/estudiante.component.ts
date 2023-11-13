import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/componentes/modal/modal.component';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { Usuario } from 'src/app/interfaces/Usuario.interface';
import { getFormattedDate } from 'src/app/modelos/variables/variables';
import { EstudianteService } from 'src/app/servicios/estudiante.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.scss']
})
export class EstudianteComponent {


  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private serviceUsuario: UsuarioService, private service: EstudianteService) { }

  modoEdicion: boolean = false;
  elementoId: string = '';
  userid = this.serviceUsuario.getUserLoggedId();

  icon = faInfoCircle;
  usuarios: Usuario[] = [];

  listEquiposE = [
    { id: 'EST_INTE', nombre: 'Internet', value: 5 },
    { id: 'EST_TV', nombre: 'TV', value: 1 },
    { id: 'EST_RAD', nombre: 'Radio', value: 2 },
    { id: 'EST_PC', nombre: 'Computador', value: 3, },
    { id: 'EST_CEL', nombre: 'Celular', value: 4 }]

  form = this.formBuilder.group({
    EST_DNI: ['', Validators.required],
    EST_NOM: ['', Validators.required],
    EST_NOM2: ['', Validators.required],
    EST_APE: ['', Validators.required],
    EST_APE2: ['', Validators.required],
    EST_FECH_NAC: [getFormattedDate(new Date()), Validators.required],
    EST_GEN: ['', Validators.required],
    EST_PRV: ['', Validators.required],
    EST_CAN: ['', Validators.required],
    EST_PARR: ['', Validators.required],
    EST_DIR: ['', Validators.required],
    EST_NAC: ['', Validators.required],
    EST_ETN: ['', Validators.required],
    EST_NAC_ETN: ['', Validators.required],
    EST_COM_ETN: ['', Validators.required],
    EST_COD_ELE: ['', Validators.required],
    EST_NEC_ASO_DIS: [false],
    EST_NEC_NO_ASO_DIS: [false],
    EST_ENF_CAT: [false],
    haveConadis: [false],
    EST_NUM_CONA: [''],
    EST_INTE: [false],
    EST_TV: [false],
    EST_RAD: [false],
    EST_PC: [false],
    EST_CEL: [false],
    REPR_ID: ['', Validators.required],
    REL_EST_REP: ['', Validators.required],
    ESTADO: [true]
  })

  ngOnInit(): void {
    this.validarEdicion();
    this.loadUsuarios();
  }


  validarEdicion() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.loadDataEdit();
      } else {
        this.modoEdicion = false;
        this.elementoId = '';
      }
    });
  }

  onSubmit() {
    this.openConfirmationModal();
  }

  crear() {
    if (this.form.valid) {
      const estudiante: Estudiante = this.buildObject();
      this.service.post(estudiante).subscribe(
        {
          next: (value) => {
            this.handleResponse(value);
          },
          error: (error) => this.handleErrorResponse(error)
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }


  editar() {
    if (this.form.valid) {
      const estudiante: Estudiante = this.buildObjectEdit();
      this.service.put(estudiante).subscribe(
        {
          next: (value) => {
            this.handleResponse(value);
          },
          error: (error) => this.handleErrorResponse(error)
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  buildObject() {
    const estudiante: Estudiante = {
      EST_ID: '0',
      EST_DNI: this.form.value.EST_DNI || '',
      EST_NOM: this.form.value.EST_NOM || '',
      EST_NOM2: this.form.value.EST_NOM2 || '',
      EST_APE: this.form.value.EST_APE || '',
      EST_APE2: this.form.value.EST_APE2 || '',
      EST_FECH_NAC: this.form.value.EST_FECH_NAC ? new Date(this.form.value.EST_FECH_NAC) : new Date(),
      EST_GEN: this.form.value.EST_GEN || '',
      EST_PRV: this.form.value.EST_PRV || '',
      EST_CAN: this.form.value.EST_CAN || '',
      EST_PARR: this.form.value.EST_PARR || '',
      EST_DIR: this.form.value.EST_DIR || '',
      EST_NAC: this.form.value.EST_NAC || '',
      EST_ETN: this.form.value.EST_ETN || '',
      EST_NAC_ETN: this.form.value.EST_NAC_ETN || '',
      EST_COM_ETN: this.form.value.EST_COM_ETN || '',
      EST_COD_ELE: this.form.value.EST_COD_ELE || '',
      EST_NEC_ASO_DIS: (this.form.value.EST_NEC_ASO_DIS) ? 1 : 0,
      EST_NEC_NO_ASO_DIS: (this.form.value.EST_NEC_NO_ASO_DIS) ? 1 : 0,
      EST_ENF_CAT: (this.form.value.EST_ENF_CAT) ? 1 : 0,
      EST_NUM_CONA: this.form.value.EST_NUM_CONA || '0',
      EST_INTE: (this.form.value.EST_INTE) ? 1 : 0,
      EST_TV: (this.form.value.EST_TV) ? 1 : 0,
      EST_RAD: (this.form.value.EST_RAD) ? 1 : 0,
      EST_PC: (this.form.value.EST_PC) ? 1 : 0,
      EST_CEL: (this.form.value.EST_CEL) ? 1 : 0,
      REPR_ID: this.form.value.REPR_ID || '',
      REL_EST_REP: this.form.value.REL_EST_REP || '',
      ESTADO: (this.form.value.ESTADO) ? 1 : 0,
      CREADOR_ID: this.userid || ''

    };
    return estudiante;
  }

  buildObjectEdit() {
    const estudiante: Estudiante = {
      EST_ID: this.elementoId,
      EST_DNI: this.form.value.EST_DNI || '',
      EST_NOM: this.form.value.EST_NOM || '',
      EST_NOM2: this.form.value.EST_NOM2 || '',
      EST_APE: this.form.value.EST_APE || '',
      EST_APE2: this.form.value.EST_APE2 || '',
      EST_FECH_NAC: this.form.value.EST_FECH_NAC ? new Date(this.form.value.EST_FECH_NAC) : new Date(),
      EST_GEN: this.form.value.EST_GEN || '',
      EST_PRV: this.form.value.EST_PRV || '',
      EST_CAN: this.form.value.EST_CAN || '',
      EST_PARR: this.form.value.EST_PARR || '',
      EST_DIR: this.form.value.EST_DIR || '',
      EST_NAC: this.form.value.EST_NAC || '',
      EST_ETN: this.form.value.EST_ETN || '',
      EST_NAC_ETN: this.form.value.EST_NAC_ETN || '',
      EST_COM_ETN: this.form.value.EST_COM_ETN || '',
      EST_COD_ELE: this.form.value.EST_COD_ELE || '',
      EST_NEC_ASO_DIS: (this.form.value.EST_NEC_ASO_DIS) ? 1 : 0,
      EST_NEC_NO_ASO_DIS: (this.form.value.EST_NEC_NO_ASO_DIS) ? 1 : 0,
      EST_ENF_CAT: (this.form.value.EST_ENF_CAT) ? 1 : 0,
      EST_NUM_CONA: (this.form.value.haveConadis) ? this.form.value.EST_NUM_CONA || '0' : '0',
      EST_INTE: (this.form.value.EST_INTE) ? 1 : 0,
      EST_TV: (this.form.value.EST_TV) ? 1 : 0,
      EST_RAD: (this.form.value.EST_RAD) ? 1 : 0,
      EST_PC: (this.form.value.EST_PC) ? 1 : 0,
      EST_CEL: (this.form.value.EST_CEL) ? 1 : 0,
      REPR_ID: this.form.value.REPR_ID || '',
      REL_EST_REP: this.form.value.REL_EST_REP || '',
      ESTADO: (this.form.value.ESTADO) ? 1 : 0,
      CREADOR_ID:this.userid
    };
    return estudiante;
  }

  loadDataEdit() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.response) {
          this.llenarForm(value.data);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadUsuarios() {
    this.serviceUsuario.getEnabled('R').subscribe({
      next: (value) => {
        if (value.response) {
          this.usuarios = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  llenarForm(data: Estudiante) {
    this.form.get('EST_DNI')?.setValue(data.EST_DNI);
    this.form.get('EST_NOM')?.setValue(data.EST_NOM);
    this.form.get('EST_NOM2')?.setValue(data.EST_NOM2);
    this.form.get('EST_APE')?.setValue(data.EST_APE);
    this.form.get('EST_APE2')?.setValue(data.EST_APE2);
    this.form.get('EST_FECH_NAC')?.setValue(getFormattedDate(data.EST_FECH_NAC));
    this.form.get('EST_GEN')?.setValue(data.EST_GEN);
    this.form.get('EST_PRV')?.setValue(data.EST_PRV);
    this.form.get('EST_CAN')?.setValue(data.EST_CAN);
    this.form.get('EST_PARR')?.setValue(data.EST_PARR);
    this.form.get('EST_DIR')?.setValue(data.EST_DIR);
    this.form.get('EST_NAC')?.setValue(data.EST_NAC);
    this.form.get('EST_ETN')?.setValue(data.EST_ETN);
    this.form.get('EST_NAC_ETN')?.setValue(data.EST_NAC_ETN);
    this.form.get('EST_COM_ETN')?.setValue(data.EST_COM_ETN);
    this.form.get('EST_COD_ELE')?.setValue(data.EST_COD_ELE);
    this.form.get('EST_NEC_ASO_DIS')?.setValue(data.EST_NEC_ASO_DIS === 1);
    this.form.get('EST_NEC_NO_ASO_DIS')?.setValue(data.EST_NEC_NO_ASO_DIS === 1);
    this.form.get('EST_ENF_CAT')?.setValue(data.EST_ENF_CAT === 1);
    this.form.get('haveConadis')?.setValue(data.EST_NUM_CONA !== '0');
    this.form.get('EST_NUM_CONA')?.setValue((data.EST_NUM_CONA !== '0') ? data.EST_NUM_CONA : '0');
    this.form.get('EST_INTE')?.setValue(data.EST_INTE === 1);
    this.form.get('EST_TV')?.setValue(data.EST_TV === 1);
    this.form.get('EST_RAD')?.setValue(data.EST_RAD === 1);
    this.form.get('EST_PC')?.setValue(data.EST_PC === 1);
    this.form.get('EST_CEL')?.setValue(data.EST_CEL === 1);
    this.form.get('REPR_ID')?.setValue(data.REPR_ID);
    this.form.get('REL_EST_REP')?.setValue(data.REL_EST_REP);
    this.form.get('ESTADO')?.setValue(data.ESTADO === 1);
    this.userid=data.CREADOR_ID;
  }

  openAlertModal(content: string, alertType: string) {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = content);
    modalRef.componentInstance.icon = (alertType == 'success') ? faCircleCheck : (alertType == 'danger') ? faCircleXmark : faInfoCircle;
    modalRef.componentInstance.color = alertType;
    modalRef.componentInstance.modal = false;
  }

  openConfirmationModal() {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
    // Usa el operador Elvis para asegurarte de que activeModal y contenido estén definidos
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = (!this.modoEdicion) ? '¿Desea guardar?' : '¿Desea editar?');
    modalRef.componentInstance.icon = faInfoCircle;
    modalRef.componentInstance.color = 'warning';
    modalRef.result.then((result) => {
      if (result === 'save') {
        if (this.modoEdicion) {
          this.editar();
        } else {
          this.crear();
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  handleResponse(value: any) {
    if (!value.response) {
      this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
      console.log(value.message);
    } else {
      if (this.modoEdicion) {
        this.openAlertModal(value.message, 'success');
        console.log(value.message);
      } else {
        this.openAlertModal(value.message, 'success');
        this.form.reset();
        this.router.navigate(['../'], { relativeTo: this.route });
      }

    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }

}
