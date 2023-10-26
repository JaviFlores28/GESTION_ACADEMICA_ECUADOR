import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard, authGuardLogin } from 'src/app/guards/auth.guard';
import { InicioComponent } from './inicio/inicio.component';
import { CursoComponent } from './admin/curso/curso.component';
import { CursosComponent } from './admin/cursos/cursos.component';
import { AnioActivoComponent } from './admin/anio-activo/anio-activo.component';
import { AreaComponent } from './admin/area/area.component';
import { AsignaturasComponent } from './admin/asignaturas/asignaturas.component';
import { ProfesoresComponent } from './admin/profesores/profesores.component';
import { RepresentantesComponent } from './admin/representantes/representantes.component';
import { EstudiantesComponent } from './admin/estudiantes/estudiantes.component';
import { MatriculasComponent } from './admin/matriculas/matriculas.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { AsignaturaComponent } from './admin/asignatura/asignatura.component';
import { ProfesorComponent } from './admin/profesor/profesor.component';
import { RepresentanteComponent } from './admin/representante/representante.component';
import { EstudianteComponent } from './admin/estudiante/estudiante.component';
import { MatriculaComponent } from './admin/matricula/matricula.component';
import { AnioLectivoComponent } from './admin/anio-lectivo/anio-lectivo.component';
import { AniosLectivosComponent } from './admin/anios-lectivos/anios-lectivos.component';
import { AreasComponent } from './admin/areas/areas.component';
import { ParalelosComponent } from './admin/paralelos/paralelos.component';
import { ParaleloComponent } from './admin/paralelo/paralelo.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [authGuardLogin] },
  {
    path: 'dashboard', component: HomeComponent, canActivate: [authGuard],
    children: [
      { path: '', component: InicioComponent },
      { path: 'home', component: CursoComponent },
      {
        path: 'docente',
        children: [{
          path: '', component: CursosComponent
        }]
      },
      {
        path: 'representante',
        children: [{
          path: '', component: CursosComponent
        }]
      },
      {
        path: 'institucion',
        children: [
          {
            path: 'anio-lectivo', children: [
              { path: 'activo', component: AnioActivoComponent },
              {
                path: 'anios',
                children: [
                  { path: '', component: AniosLectivosComponent },
                  { path: 'nuevo', component: AnioLectivoComponent },
                  { path: 'editar/:id', component: AnioLectivoComponent },
                ]
              },
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
          }
          ,
          {
            path: 'profesores',
            children: [
              { path: '', component: ProfesoresComponent },
              { path: 'nuevo', component: ProfesorComponent },
              { path: 'editar/:id', component: ProfesorComponent },
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
            path: 'paralelos',
            children: [
              { path: '', component: ParalelosComponent },
              { path: 'nuevo', component: ParaleloComponent },
              { path: 'editar/:id', component: ParaleloComponent },
            ]
          },
          {
            path: 'representantes',
            children: [
              { path: '', component: RepresentantesComponent },
              { path: 'nuevo', component: RepresentanteComponent },
              { path: 'editar/:id', component: RepresentanteComponent },
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
              { path: '', component: MatriculasComponent },
              { path: 'nuevo', component: MatriculaComponent },
              { path: 'editar/:id', component: MatriculaComponent },
            ]
          },]
      },
      {
        path: 'usuarios',
        children: [
          { path: '', component: UsuariosComponent, },
          { path: 'myinfo/:id', component: UsuarioComponent },
        ]

      },


    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
