import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Area } from 'src/app/interfaces/Area.interface';
import { AreaService } from 'src/app/servicios/area.service';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { ModalService } from 'src/app/servicios/modal.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
})
export class AreaComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private service: AreaService,
    private usuarioService: AutentificacionService,
    private modalService: ModalService,
  ) { }

  modoEdicion: boolean = false;
  editItemId: string = '';
  modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?';
  USR_ID = this.usuarioService.getUserIdLocal();

  form = this.formBuilder.group({
    nom: ['', Validators.required],
    estado: [true],
  });

  ngOnInit(): void {
    this.validarEdicion();
  }

  validarEdicion() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.editItemId = id;
        this.modaltitle = 'Editar';
        this.modalMsg = '¿Desea editar el registro?'; 
        this.loadDataEdit();
      } else {
        this.modoEdicion = false;
        this.editItemId = '';
      }
    });
  }

  onSubmit() {
    this.openModal(this.modaltitle, this.modalMsg, 'warning', true);
  }

  crear() {
    if (this.form.valid) {
      const area: Area = this.buildObject();
      this.service.post(area).subscribe({
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  editar() {
    if (this.form.valid) {
      const area: Area = this.buildObjectEdit();
      this.service.put(area).subscribe({
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  buildObject() {
    const area: Area = {
      AREA_ID: '0',
      AREA_NOM: this.form.value.nom || '',
      ESTADO: this.form.value.estado ? 1 : 0,
    };
    return area;
  }

  buildObjectEdit() {
    const area: Area = {
      AREA_ID: this.editItemId,
      AREA_NOM: this.form.value.nom || '',
      ESTADO: this.form.value.estado ? 1 : 0,
    };
    return area;
  }

  loadDataEdit() {
    this.service.getById(this.editItemId).subscribe({
      next: (value) => {
        if (value.response) {
          this.llenarForm(value.data);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarForm(data: Area) {
    this.form.get('estado')?.setValue(data.ESTADO === 1);
    this.form.get('nom')?.setValue(data.AREA_NOM);
  }


  openModal(tittle: string, message: string, alertType: string, form: boolean) {
    this.modalService.openModal(tittle, message, alertType, form)
      .then((result) => {
        if (result === 'save' && form) {
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
      this.openModal('Oops...', 'Ha ocurrido un error intente nuevamente.', 'danger', false);
      console.log(value.message);
    } else {
      if (this.modoEdicion) {
        this.openModal('¡Completado!', value.message, 'success', false);
      } else {
        this.openModal('¡Completado!', value.message, 'success', false);
        this.clear();
      }
    }
  }

  handleErrorResponse(error: any) {
    this.openModal('Oops...', error, 'danger', false);
    console.log(error);
  }

  clear() {
    this.form.reset();
    this.router.navigate(['../'], { relativeTo: this.route });
  }


}
