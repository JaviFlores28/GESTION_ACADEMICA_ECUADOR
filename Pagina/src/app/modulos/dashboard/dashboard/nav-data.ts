import { faBookOpen, faChalkboardTeacher, faChildren, faGears, faGraduationCap, faHome, faLaptopFile, faPenRuler, faPeopleGroup, faPeopleLine, faPeopleRoof, faPerson, faPersonChalkboard, faSchool, faSubscript, faUser, faUserGear, faUsers, faUsersLine, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
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
    label: 'Sistema',
    rol: 'A',
    icon: faGears,
  },
  {
    routelink: 'anios',
    label: 'Años lectivos',
    rol: 'A',
    icon: faGraduationCap,
    items: [
      {
        routelink: 'all',
        label: 'Todos',
      },
      {
        routelink: 'inicializar',
        label: 'Inicializar',
      },
      {
        routelink: 'periodos',
        label: 'Periodos',
      },
    ],
  },
  {
    routelink: 'areas',
    label: 'Areas',
    rol: 'A',
    icon: faPenRuler,
  }, 
  {
    routelink: 'asignaturas',
    label: 'Asignaturas',
    rol: 'A',
    icon: faSubscript,
  },
  {
    routelink: 'cursos',
    label: 'Cursos',
    rol: 'A',
    icon: faPeopleRoof,
  },
  {
    routelink: 'paralelos',
    label: 'Paralelos',
    rol: 'A',
    icon: faUsersRectangle,
  },
  {
    routelink: 'representantes',
    label: 'Representantes',
    rol: 'A',
    icon: faUser,
  },
  {
    routelink: 'estudiantes',
    label: 'Estudiantes',
    rol: 'A',
    icon: faPeopleLine,
  },
  {
    routelink: 'profesores',
    label: 'Profesores',
    rol: 'A',
    icon: faPersonChalkboard,
  },
  {
    routelink: 'usuarios',
    label: 'Administradores',
    rol: 'A',
    icon: faUserGear,
  },
  {
    routelink: 'matriculas',
    label: 'Matrículas',
    rol: 'A',
    icon: faBookOpen,
    items: [
      {
        routelink: 'asignar-cursos',
        label: 'Asignar Cursos',
      },
      {
        routelink: 'asignar-paralelo',
        label: 'Asignar paralelos',
      },
      {
        routelink: 'asignar-profesor',
        label: 'Asignar profesores',
      },
    ]
  },
  {
    routelink: 'docente',
    icon: faChalkboardTeacher,
    label: 'Profesores',
    rol: 'P',
    items: [
      {
        routelink: 'cursos',
        label: 'Mis cursos',
      },
      {
        routelink: 'horarios',
        label: 'Horarios',
      }
    ],
  },
  {
    routelink: 'Representante',
    icon: faUsers,
    label: 'Representante',
    rol: 'R',
    items: [
      {
        routelink: 'horarios',
        label: 'Horarios',
      },
      {
        routelink: 'calificaciones',
        label: 'Calificaciones',
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
