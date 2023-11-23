import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Asignatura } from 'src/app/interfaces/Asignatura.interface';
import { Curso } from 'src/app/interfaces/Curso.interface';
import { Paralelo } from 'src/app/interfaces/Paralelo.interface';
import { ProfesorAsignaturaParalelo } from 'src/app/interfaces/ProfesorAsignaturaParalelo.interface';
import { Usuario } from 'src/app/interfaces/Usuario.interface';
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
    private ngBootstrap: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private service: ProfesorAsignaturaService,
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private paraleloService: ParaleloService,
    private asignaturaService: AsignaturaService,
    private modalService: ModalService,
  ) {}

  icon = faInfoCircle;
  modoEdicion: boolean = false;
  elementoId: string = '';
  msg: string = '¿Desea guardar?';
  userid = this.usuarioService.getUserLoggedId();

  profesores: Usuario[] = [];
  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  asignaturas: Asignatura[] = [];
  table: ProfesorAsignaturaParalelo[] = [];

  headers = ['PROFESOR', 'CURSO', 'PARALELO', 'ASIGNATURA', 'ESTADO'];
  campos = ['PRF_ASG_PRLL_ID', 'PRF_ID', 'CRS_ID', 'PRLL_ID', 'ASG_ID'];

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
  }

  onSubmit() {
    this.openConfirmationModal(this.msg);
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

  openAlertModal(content: string, alertType: string) {
    this.modalService.openAlertModal(content, alertType);
  }

  openConfirmationModal(message: string) {
    this.modalService
      .openConfirmationModal(message)
      .then((result) => {
        if (result === 'save') {
          if (this.modoEdicion) {
          } else {
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  eliminar(data: any) {}
  checkedsAction(data: any) {}
  filaAction(data: any) {}
}
