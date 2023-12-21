import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  headers = ['PROFESOR', 'CURSO', 'TIPO', 'PARALELO', 'ASIGNATURA'];
  campos = ['PRF_ASG_PRLL_ID', 'PRF_NOM', 'CRS_NOM', 'CRS_TIPO', 'PRLL_NOM', 'ASG_NOM'];
  headersAsg = ['NOMBRE'];
  camposAsg = ['ASG_ID', 'ASG_NOM'];

  modoEdicion: boolean = false;
  elementoId: string = '';
  msg: string = '¿Desea guardar?';
  USR_ID: string = this.usuarioService.getUserLoggedId();
  AL_ID: string = '0';
  ESTADO: number = 1;
  existeAnio: boolean = false;

  form: FormGroup = this.formBuilder.group({
    PRF_ID: ['', Validators.required],
    CRS_ID: ['', Validators.required],
    PRLL_ID: ['', Validators.required],
    ASG_ID: [[], Validators.required],
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
    this.openModal('Guardar', this.msg, 'success', true);
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
          console.log(value.data);

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
    this.ESTADO = data.ESTADO;
  }

  crear() {
    if (this.form.valid) {
      const profesorAsignaturaParalelo = this.buildObject();
      this.service.postMasivo(profesorAsignaturaParalelo).subscribe({
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
    const profesorAsignaturaParalelo = {
      PRF_ASG_PRLL_ID: '0',
      PRF_ID: this.form.value.PRF_ID || '',
      AL_ID: this.AL_ID || '',
      arrayIds: this.form.value.ASG_ID || '',
      CRS_ID: this.form.value.CRS_ID || '',
      PRLL_ID: this.form.value.PRLL_ID || '',
      ESTADO: this.ESTADO,
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
    };
    return profesorAsignaturaParalelo;
  }

  openModal(tittle: string, message: string, alertType: string, modal: boolean) {
    this.modalService.openModal(tittle, message, alertType, modal)
      .then((result) => {
        if (result === 'save' && modal) {
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
        this.openModal('Editar', value.message, 'success', false);
        this.clear();
      } else {
        this.openModal('Agregar', value.message, 'success', false);
        this.clear();
      }
    }
  }

  handleErrorResponse(error: any) {
    this.openModal('Oops...', error, 'danger', false);
    console.log(error);
  }

  clear() {
    this.loadTable();
    this.form.reset();
    this.modoEdicion = false;
    this.loadAnioLectivo();
  }

  eliminar(data: any) { }
  checkedsAction(data: any) {
    console.log(data);
  }

  filaAction(data: any) {
    if (data.option === 'editar') {
      this.modoEdicion = true;
      this.elementoId = data.id;
      this.loadDataEdit();
    } else if (data.option === 'eliminar') {
      this.modoEdicion = false;
      this.elementoId = data.elementoId;
      this.msg = '¿Desea eliminar?';
      this.openModal('Eliminar', this.msg, 'warning', true);
    }
  }

  checkAsg(data: any) {
    console.log(data);
  }
}
