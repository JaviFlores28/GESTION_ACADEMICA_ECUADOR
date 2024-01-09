import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Paralelo } from 'src/app/interfaces/Paralelo.interface';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-paralelo',
  templateUrl: './paralelo.component.html',
  styleUrls: ['./paralelo.component.scss'],
})
export class ParaleloComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private usuarioService: AutentificacionService,
    private service: ParaleloService,
    private modalService: ModalService,
  ) { }

  modoEdicion: boolean = false;
  elementoId: string = '';
  modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?'; 
  icon = faInfoCircle;
  USR_ID = this.usuarioService.getUserIdLocal();

  form = this.formBuilder.group({
    PRLL_NOM: ['', Validators.required],
    ESTADO: [true],
  });

  ngOnInit(): void {
    this.validarEdicion();
  }

  validarEdicion() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.modaltitle = 'Editar';
        this.modalMsg = '¿Desea editar el registro?'; 
        this.loadataEdit();
      } else {
        this.modoEdicion = false;
        this.elementoId = '';
      }
    });
  }

  onSubmit() {
    this.openModal(this.modaltitle, this.modalMsg, 'warning', true);
  }

  crear() {
    if (this.form.valid) {
      const paralelo: Paralelo = this.buildObject();
      this.service.post(paralelo).subscribe({
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
      const paralelo: Paralelo = this.buildObjectEdit();

      this.service.put(paralelo).subscribe({
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
    const paralelo: Paralelo = {
      PRLL_ID: '0',
      PRLL_NOM: this.form.value.PRLL_NOM || '',
      ESTADO: this.form.value.ESTADO ? 1 : 0,
    };
    return paralelo;
  }

  buildObjectEdit() {
    const paralelo: Paralelo = {
      PRLL_ID: this.elementoId,
      PRLL_NOM: this.form.value.PRLL_NOM || '',
      ESTADO: this.form.value.ESTADO ? 1 : 0,
    };
    return paralelo;
  }

  loadataEdit() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.data) {
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

  llenarForm(data: Paralelo) {
    this.form.get('PRLL_NOM')?.setValue(data.PRLL_NOM);
    this.form.get('ESTADO')?.setValue(data.ESTADO === 1);
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
      //'Ha ocurrido un error intente nuevamente.'
      this.openModal('Oops...', value.message, 'danger', false);
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
