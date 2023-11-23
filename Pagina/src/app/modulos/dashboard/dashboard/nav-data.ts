import { faChalkboardTeacher, faGears, faHome, faLaptopFile, faSchool, faUsers } from '@fortawesome/free-solid-svg-icons';
import { NavBarData } from 'src/app/sistema/interfaces/NavBarData.interface';

export const navbarData: NavBarData[] = [
  {
    routelink: '/dashboard',
    icon: faHome,
    label: 'Inicio',
    rol: 'T',
  },
  {
    routelink: 'sistema',
    icon: faGears,
    label: 'Sistema',
    rol: 'A',
    items: [
      {
        routelink: 'anios',
        label: 'Años lectivos',
      },
      {
        routelink: 'areas',
        label: 'Areas',
      },
      {
        routelink: 'paralelos',
        label: 'Paralelos',
      },
      {
        routelink: 'cursos',
        label: 'Cursos',
      },
      {
        routelink: 'asignaturas',
        label: 'Asignaturas',
      },
      {
        routelink: 'representantes',
        label: 'Representantes',
      },
      {
        routelink: 'estudiantes',
        label: 'Estudiantes',
      },
      {
        routelink: 'profesores',
        label: 'Profesores',
      },
      {
        routelink: 'usuarios',
        label: 'Administradores',
      },
    ],
  },
  {
    routelink: 'institucion',
    icon: faSchool,
    label: 'Institución',
    rol: 'A',
    items: [
      {
        routelink: 'iniciar-anio',
        label: 'Iniciar Año lectivo',
      },

      {
        routelink: 'matriculas',
        label: 'Matrículas',
      },
      {
        routelink: 'asignar-paralelo',
        label: 'Asignar paralelos',
      },
      {
        routelink: 'asignar-profesor',
        label: 'Asignar profesores',
      },
      {
        routelink: 'solicitudes',
        label: 'Solicitudes',
      },
    ],
  },
  {
    routelink: 'docente',
    icon: faChalkboardTeacher,
    label: 'Profesores',
    rol: 'T',
    items: [
      {
        routelink: 'cursos',
        label: 'Mis cursos',
      },
      {
        routelink: 'horarios',
        label: 'Horarios',
      },
      {
        routelink: 'planes-tudios',
        label: 'Planes de estudio',
      },
    ],
  },
  {
    routelink: 'Representante',
    icon: faUsers,
    label: 'Representante',
    rol: 'T',
    items: [
      {
        routelink: 'horarios',
        label: 'Horarios',
      },
      {
        routelink: 'calificaciones',
        label: 'Calificaciones',
      },
      {
        routelink: 'planestudios',
        label: 'Planes de estudio',
      },
      {
        routelink: 'solicitudes',
        label: 'Solicitudes',
      },
    ],
  },
  {
    routelink: 'reporte',
    icon: faLaptopFile,
    label: 'Reportes',
    rol: 'T',
    items: [
      {
        routelink: 'calificaciones',
        label: 'Calificaciones',
      },
      {
        routelink: 'cursos',
        label: 'Cursos',
      },
    ],
  },
];
