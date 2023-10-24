import { faChalkboardTeacher, faHome, faLaptopFile, faSchool, faUsers } from "@fortawesome/free-solid-svg-icons";
import { NavBarData } from "src/app/modelos/interfaces/NavBarData.interface";


export const navbarData: NavBarData[] = [
    {
        routelink: '/dashboard',
        icon: faHome,
        label: 'Inicio',
        rol: 'T'
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
                items: [
                    {
                        routelink: 'cursos',
                        label: 'Mis cursos',
                    },]
            },
        ]
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
                routelink: 'estudiantes',
                label: 'Estudiantes',
            },
            {
                routelink: 'planestudios',
                label: 'Planes de estudio',
            },
            {
                routelink: 'solicitudes',
                label: 'Solicitudes',
            },
            {
                routelink: 'reportes',
                label: 'Reportes',
            },
        ]

    },
    {
        routelink: 'institucion',
        icon: faSchool,
        label: 'Institución',
        rol: 'T',
        items: [
            {
                routelink: 'anio-lectivo',
                label: 'Año lectivo',
            },
            {
                routelink: 'asignaturas',
                label: 'Asignaturas',
            },
            {
                routelink: 'profesores',
                label: 'Profesores',
            },
            {
                routelink: 'cursos',
                label: 'Cursos',
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
                routelink: 'matriculas',
                label: 'Matrículas',
            },
            {
                routelink: 'solicitudes',
                label: 'Solicitudes',
            },
        ]
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
            }
        ]
    },

    {
        routelink: 'usuarios',
        icon: faUsers,
        label: 'Usuarios',
        rol: 'T'
    },

];