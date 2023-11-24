import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Asignatura } from 'src/app/interfaces/Asignatura.interface';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { Paralelo } from 'src/app/interfaces/Paralelo.interface';
import { ProfesorAsignaturaParalelo } from 'src/app/interfaces/ProfesorAsignaturaParalelo.interface';
import { Usuario } from 'src/app/interfaces/Usuario.interface';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { AsignaturaService } from 'src/app/servicios/asignatura.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';
import { ProfesorAsignaturaService } from 'src/app/servicios/profesor-asignatura.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-profesor-asignatura',
  templateUrl: './profesor-asignatura.component.html',
  styleUrls: ['./profesor-asignatura.component.scss'],
})
export class ProfesorAsignaturaComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private service: ProfesorAsignaturaService,
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private paraleloService: ParaleloService,
    private asignaturaService: AsignaturaService,
    private modalService: ModalService,
    private anioService: AnioLectivoService
  ) { }

  profesores: Usuario[] = [];
  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  asignaturas: Asignatura[] = [];
  table: ProfesorAsignaturaParalelo[] = [];

  headers = ['PROFESOR', 'CURSO', 'PARALELO', 'ASIGNATURA', 'ESTADO'];
  campos = ['PRF_ASG_PRLL_ID', 'PRF_ID', 'CRS_ID', 'PRLL_ID', 'ASG_ID'];

  modoEdicion: boolean = false;
  elementoId: string = '';
  msg: string = '¿Desea guardar?';
  USR_ID: string = this.usuarioService.getUserLoggedId();
  AL_ID: string = '0';
  ESTADO: number = 1;
existeAnio: boolean = false;
  form = this.formBuilder.group({
    PRF_ID: ['', Validators.required],
    CRS_ID: ['', Validators.required],
    PRLL_ID: ['', Validators.required],
    ASG_ID: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadTable();
    this.loadUsuarios();
    this.loadCursos();
    this.loadParalelos();
    this.loadAsignaturas();
    this.loadAnioLectivo();
  }

  onSubmit() {
    this.openConfirmationModal(this.msg);
  }

  loadAnioLectivo() {
    this.anioService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.AL_ID = value.data[0].AL_ID;
          this.existeAnio = true;
        } else {
          this.existeAnio = false;
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  loadTable() {
    this.service.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.table = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadUsuarios() {
    this.usuarioService.getEnabled('P').subscribe({
      next: (value) => {
        if (value.response) {
          this.profesores = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadCursos() {
    this.cursoService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.cursos = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadParalelos() {
    this.paraleloService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.paralelos = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadAsignaturas() {
    this.asignaturaService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.asignaturas = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
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
      },
    });
  }

  llenarForm(data: ProfesorAsignaturaParalelo) {
    this.form.get('PRF_ID')?.setValue(data.PRF_ID);
    this.form.get('ASG_ID')?.setValue(data.ASG_ID);
    this.form.get('CRS_ID')?.setValue(data.CRS_ID);
    this.form.get('PRLL_ID')?.setValue(data.PRLL_ID);
    this.AL_ID = data.AL_ID;
    this.USR_ID = data.CREADOR_ID;
    this.ESTADO = data.ESTADO;
  }

  crear() {
    if (this.form.valid) {
      const profesorAsignaturaParalelo: ProfesorAsignaturaParalelo = this.buildObject();
      this.service.post(profesorAsignaturaParalelo).subscribe({
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
      const profesorAsignaturaParalelo: ProfesorAsignaturaParalelo = this.buildObjectEdit();
      this.service.put(profesorAsignaturaParalelo).subscribe({
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
    const profesorAsignaturaParalelo: ProfesorAsignaturaParalelo = {
      PRF_ASG_PRLL_ID: '0',
      PRF_ID: this.form.value.PRF_ID || '',
      AL_ID: this.AL_ID || '',
      ASG_ID: this.form.value.ASG_ID || '',
      CRS_ID: this.form.value.CRS_ID || '',
      PRLL_ID: this.form.value.PRLL_ID || '',
      ESTADO: this.ESTADO,
      CREADOR_ID: this.USR_ID,
    };
    return profesorAsignaturaParalelo;
  }

  buildObjectEdit() {
    const profesorAsignaturaParalelo: ProfesorAsignaturaParalelo = {
      PRF_ASG_PRLL_ID: this.elementoId,
      PRF_ID: this.form.value.PRF_ID || '',
      AL_ID: this.AL_ID || '',
      ASG_ID: this.form.value.ASG_ID || '',
      CRS_ID: this.form.value.CRS_ID || '',
      PRLL_ID: this.form.value.PRLL_ID || '',
      ESTADO: this.ESTADO,
      CREADOR_ID: this.USR_ID,
    };
    return profesorAsignaturaParalelo;
  }

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  openConfirmationModal(message: string) {
    this.modalService
      .openConfirmationModal(message)
      .then((result) => {
        if (result === 'save') {
          if (!this.modoEdicion) {
            this.crear();
          } else {
            this.editar();
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
        this.clear();
      } else {
        this.openAlertModal(value.message, 'success');
        this.clear();
      }
    }
  }

  clear() {
    this.loadTable();
    this.form.reset();
    this.modoEdicion = false;
    this.loadAnioLectivo();
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }

  eliminar(data: any) { }
  checkedsAction(data: any) { }

  filaAction(data: any) {
    if (data.option === 'editar') {
      this.modoEdicion = true;
      this.elementoId = data.id;
      this.loadDataEdit();
    } else if (data.option === 'eliminar') {
      this.modoEdicion = false;
      this.elementoId = data.elementoId;
      this.msg = '¿Desea eliminar?';
      this.openConfirmationModal(this.msg);
    }
  }
}
