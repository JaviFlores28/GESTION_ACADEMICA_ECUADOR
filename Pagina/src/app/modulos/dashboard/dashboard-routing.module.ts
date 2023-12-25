import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuardDash, authGuardLogin, isAdmin } from 'src/app/guards/auth.guard';
import { InicioComponent } from './inicio/inicio.component';
import { CursoComponent } from './admin/curso/curso.component';
import { CursosComponent } from './admin/cursos/cursos.component';
import { AreaComponent } from './admin/area/area.component';
import { AsignaturasComponent } from './admin/asignaturas/asignaturas.component';
import { ProfesoresComponent } from './admin/profesores/profesores.component';
import { RepresentantesComponent } from './admin/representantes/representantes.component';
import { EstudiantesComponent } from './admin/estudiantes/estudiantes.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { AsignaturaComponent } from './admin/asignatura/asignatura.component';
import { EstudianteComponent } from './admin/estudiante/estudiante.component';
import { AnioLectivoComponent } from './admin/anio-lectivo/anio-lectivo.component';
import { AniosLectivosComponent } from './admin/anios-lectivos/anios-lectivos.component';
import { AreasComponent } from './admin/areas/areas.component';
import { ParalelosComponent } from './admin/paralelos/paralelos.component';
import { ParaleloComponent } from './admin/paralelo/paralelo.component';
import { ProfesorAsignaturaComponent } from './admin/profesor-asignatura/profesor-asignatura.component';
import { EstudianteCursoComponent } from './admin/estudiante-curso/estudiante-curso.component';
import { EstudianteParaleloComponent } from './admin/estudiante-paralelo/estudiante-paralelo.component';
import { ProfesorCursosAsignaturasComponent } from './docente/profesor-cursos-asignaturas/profesor-cursos-asignaturas.component';
import { ProfesorHorariosComponent } from './docente/profesor-horarios/profesor-horarios.component';
import { CalificacionesComponent } from './docente/calificaciones/calificaciones.component';
import { PeriodosComponent } from './admin/periodos/periodos.component';
import { ReporteCalificacionesComponent } from './admin/reporte-calificaciones/reporte-calificaciones.component';
import { ReporteCursosComponent } from './admin/reporte-cursos/reporte-cursos.component';
import { ParametrosComponent } from './admin/parametros/parametros.component';
import { EstudiantesParalelosComponent } from './admin/estudiantes-paralelos/estudiantes-paralelos.component';
import { EstudiantesCursosComponent } from './admin/estudiantes-cursos/estudiantes-cursos.component';
import { AdministradoresComponent } from './admin/administradores/administradores.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent,canActivate: [authGuardLogin] },
  {
    path: '', component: HomeComponent, canActivate:[authGuardDash],
    children: [
      { path: '', component: InicioComponent },
      { path: 'sistema', component: ParametrosComponent },
      {
        path: 'anios',
        children: [
          { path: 'all', component: AniosLectivosComponent },
          { path: 'inicializar', component: AnioLectivoComponent },
          { path: 'periodos', component: PeriodosComponent },
          { path: 'editar/:id', component: AnioLectivoComponent },
        ]
      },
      {
        path: 'areas',
        children: [
          { path: '', component: AreasComponent },
          { path: 'nuevo', component: AreaComponent },
          { path: 'editar/:id', component: AreaComponent },
        ]
      },
      {
        path: 'asignaturas',
        children: [
          { path: '', component: AsignaturasComponent },
          { path: 'nuevo', component: AsignaturaComponent },
          { path: 'editar/:id', component: AsignaturaComponent },
        ]
      },
      {
        path: 'profesores',
        children: [
          { path: 'all', component: ProfesoresComponent },
          { path: 'nuevo', component: UsuarioComponent },
          { path: 'editar/:id', component: UsuarioComponent },
          { path: 'asignar-profesor', component: ProfesorAsignaturaComponent },
        ]
      },
      {
        path: 'cursos',
        children: [
          { path: '', component: CursosComponent },
          { path: 'nuevo', component: CursoComponent },
          { path: 'editar/:id', component: CursoComponent },
        ]
      },
      {
        path: 'representantes',
        children: [
          { path: '', component: RepresentantesComponent },
          { path: 'nuevo', component: UsuarioComponent },
          { path: 'editar/:id', component: UsuarioComponent },
        ]
      },
      {
        path: 'estudiantes',
        children: [
          { path: '', component: EstudiantesComponent },
          { path: 'nuevo', component: EstudianteComponent },
          { path: 'editar/:id', component: EstudianteComponent },
        ]
      },
      {
        path: 'matriculas',
        children: [
          { path: 'all', component: EstudiantesCursosComponent },
          { path: 'asignar-cursos', component: EstudianteCursoComponent },
        ]
      },
      {
        path: 'paralelos',
        children: [
          { path: 'all', component: ParalelosComponent },
          { path: 'nuevo', component: ParaleloComponent },
          { path: 'editar/:id', component: ParaleloComponent },
          { path: 'all-asignaciones', component: EstudiantesParalelosComponent },
          { path: 'asignar-paralelo', component: EstudianteParaleloComponent },
        ]
      },
      {
        path: 'administradores',
        children: [
          { path: '', component: AdministradoresComponent },
          { path: 'nuevo', component: UsuarioComponent },
          { path: 'editar/:id', component: UsuarioComponent },
        ]
      },
      {
        path: 'reporte',
        children: [
          { path: 'calificaciones', component: ReporteCalificacionesComponent },
          { path: 'cursos', component: ReporteCursosComponent },
        ]
      },
      { path: 'myinfo/:id', component: UsuarioComponent },
      {
        path: 'docente',
        children: [
          {
            path: 'cursos',
            children: [
              { path: '', component: ProfesorCursosAsignaturasComponent },
              { path: 'calificaciones/:id', component: CalificacionesComponent },

            ]
          },
          { path: 'horarios', component: ProfesorHorariosComponent },

        ],
      },
      {
        path: 'representante',
        children: [
          {
            path: 'horarios',
            component: CursosComponent,
          },
          {
            path: 'calificaciones',
            component: CursosComponent,
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
