import { Component, OnInit } from '@angular/core';
import { AnioLectivoService } from 'src/app/servicios/anio-lectivo.service';
import { ProfesorAsignaturaService } from 'src/app/servicios/profesor-asignatura.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-profesor-cursos-asignaturas',
  templateUrl: './profesor-cursos-asignaturas.component.html',
  styleUrls: ['./profesor-cursos-asignaturas.component.scss']
})
export class ProfesorCursosAsignaturasComponent implements OnInit {
  constructor(
    private service: ProfesorAsignaturaService,
    private usuarioService: UsuarioService,
    private anioService: AnioLectivoService
  ) { }


  data: any[] = [];
  campos: any[] = ['PRF_ASG_PRLL_ID', 'AL_ID', 'ASG_ID', 'CRS_ID', 'PRLL_ID', 'PRF_ID'];
  headers: any[] = ['Año lectivo', 'Asignatura', 'Curso', 'Paralelo', 'Profesor', 'ESTADO'];

  title = 'Asignaturas';
  USR_ID: string = this.usuarioService.getUserLoggedId();
  AL_ID: string = '0';
  existeAnio: boolean = false;

  ngOnInit(): void {
    this.loadAnioLectivo();
  }

  loadTable() {
    const data = { PRF_ID: this.USR_ID, AL_ID: this.AL_ID };
    this.service.getByPrf(data).subscribe({
      next: (value) => {
        if (value.response) {
          console.log(value.data);

          this.data = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  loadAnioLectivo() {
    this.anioService.getEnabled().subscribe({
      next: (value) => {
        if (value.response) {
          this.AL_ID = value.data[0].AL_ID;
          this.existeAnio = true;
          this.loadTable();
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

  filaAction(value: any) {
    console.log(value)
  }
}
