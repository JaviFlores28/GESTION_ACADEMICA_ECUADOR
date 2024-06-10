import { faBookOpen, faChalkboardTeacher, faChildren, faFlaskVial, faGears, faGraduationCap, faHome, faLaptopFile, faPenRuler, faPeopleGroup, faPeopleLine, faPeopleRoof, faPerson, faPersonChalkboard, faSchool, faSubscript, faUser, faUserGear, faUsers, faUsersLine, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import { NavBarData } from 'src/app/sistema/interfaces/NavBarData.interface';

export const navbarData: NavBarData[] = [
  {
    routelink: '',
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
        routelink: 'inicializar',
        label: 'Inicializar',
      },
      {
        routelink: 'all',
        label: 'Todos',
      },
      {
        routelink: 'periodos',
        label: 'Periodos',
      },
    ],
  },
  {
    routelink: 'areas',
    label: 'Áreas',
    rol: 'A',
    icon: faFlaskVial,
  },
  {
    routelink: 'asignaturas',
    label: 'Asignaturas',
    rol: 'A',
    icon: faPenRuler,
  },
  {
    routelink: 'cursos',
    label: 'Cursos',
    rol: 'A',
    icon: faPeopleRoof,
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
    items: [
      {
        routelink: 'all',
        label: 'Todos',
      },
      {
        routelink: 'asignar-profesor',
        label: 'Asignar profesores',
      },
    ]
  },
  {
    routelink: 'administradores',
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
     /*  {
        routelink: 'all',
        label: 'Todos',
      }, */
      {
        routelink: 'asignar-cursos',
        label: 'Asignar Cursos',
      }
    ]
  },
  {
    routelink: 'paralelos',
    label: 'Paralelos',
    rol: 'A',
    icon: faUsersRectangle,
    items: [
      {
        routelink: 'all',
        label: 'Todos',
      },
     /*  {
        routelink: 'all-asignaciones',
        label: 'Asignaciones',
      }, */
      {
        routelink: 'asignar-paralelo',
        label: 'Asignar paralelos',
      }
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
     /*  {
        routelink: 'horarios',
        label: 'Horarios',
      } */
    ],
  },
  {
    routelink: 'representante',
    icon: faUsers,
    label: 'Representante',
    rol: 'R',
    items: [
    /*   {
        routelink: 'horarios',
        label: 'Horarios',
      }, */
      {
        routelink: 'reportes',
        label: 'Estudiantes',
      },
    ],
  },
  {
    routelink: 'reporte',
    icon: faLaptopFile,
    label: 'Reportes',
    rol: 'A',
    items: [
      {
        routelink: 'calificaciones',
        label: 'Calificaciones',
      },
      {
        routelink: 'institucion',
        label: 'Institución',
      },
    ],
  },
];
