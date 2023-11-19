import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Area } from 'src/app/interfaces/Area.interface';
import { AreaService } from 'src/app/servicios/area.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private service: AreaService,
    private usuarioService: UsuarioService,
    private modalService: ModalService
  ) { }

  modoEdicion: boolean = false;
  elementoId: string = '';
  msg: string = '¿Desea guardar?';
  userid = this.usuarioService.getUserLoggedId();

  icon = faInfoCircle;

  form = this.formBuilder.group({
    nom: ['', Validators.required],
    estado: [true]
  });

  ngOnInit(): void {
    this.validarEdicion();
  }

  validarEdicion() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.msg = '¿Desea editar?';
        this.loadDataEdit();
      } else {
        this.modoEdicion = false;
        this.elementoId = '';
      }
    });
  }

  onSubmit() {
    this.openConfirmationModal(this.msg);
  }

  crear() {
    if (this.form.valid) {
      const area: Area = this.buildObject();
      this.service.post(area).subscribe(
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
      const area: Area = this.buildObjectEdit();
      this.service.put(area).subscribe(
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
    const area: Area = {
      AREA_ID: '0',
      AREA_NOM: this.form.value.nom || '',
      ESTADO: (this.form.value.estado) ? 1 : 0,
      CREADOR_ID: this.userid
    };
    return area;
  }

  buildObjectEdit() {
    const area: Area = {
      AREA_ID: this.elementoId,
      AREA_NOM: this.form.value.nom || '',
      ESTADO: (this.form.value.estado) ? 1 : 0,
      CREADOR_ID: this.userid
    };
    return area;
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

  llenarForm(data: Area) {
    this.form.get('estado')?.setValue(data.ESTADO === 1);
    this.form.get('nom')?.setValue(data.AREA_NOM); 
    this.userid = data.CREADOR_ID
  }

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  openConfirmationModal(message: string) {
    this.modalService.openConfirmationModal(message)
      .then((result) => {
        if (result === 'save') {
          if (this.modoEdicion) {
            this.editar();
          } else {
            this.crear();
          }
        }
      })
      .catch((error) => {
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
