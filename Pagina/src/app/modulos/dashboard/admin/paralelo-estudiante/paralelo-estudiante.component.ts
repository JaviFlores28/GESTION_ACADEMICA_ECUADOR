import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Curso } from 'src/app/modelos/interfaces/Curso.interface';
import { Paralelo } from 'src/app/modelos/interfaces/Paralelo.interface';
import { CursoService } from 'src/app/servicios/curso.service';
import { ParaleloEstudianteService } from 'src/app/servicios/paralelo-estudiante.service';
import { ParaleloService } from 'src/app/servicios/paralelo.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-paralelo-estudiante',
  templateUrl: './paralelo-estudiante.component.html',
  styleUrls: ['./paralelo-estudiante.component.scss']
})
export class ParaleloEstudianteComponent implements OnInit {
  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private serviceUsuario: UsuarioService, private service: ParaleloEstudianteService, private serviceCurso: CursoService, private serviceParalelo: ParaleloService) { }

  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];

  icon = faInfoCircle;

  form = this.formBuilder.group({
    PRLL_ID: ['', Validators.required],
    CRS_ID: ['', Validators.required],
    MTR_ID: ['', Validators.required],
    ESTADO: [false, Validators.required]
  })

  ngOnInit(): void {
    this.loadCursos()
    this.loadParalelos()
  }

  onSubmit(){}

  loadCursos() {
    this.serviceCurso.getEnabled().subscribe({
      next: (value) => {
        if (value.data) {
          this.cursos = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadParalelos() {
    this.serviceParalelo.getEnabled().subscribe({
      next: (value) => {
        if (value.data) {
          this.paralelos = value.data
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
