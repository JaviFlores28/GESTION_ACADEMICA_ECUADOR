import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import session from 'express-session';

import AnioLectivoServicio from './servicios/AnioLectivoServicio';
import AreaServicio from './servicios/AreaServicio';
import AsignaturaServicio from './servicios/AsignaturaServicio';
import CalificacionesCualitativasServicio from './servicios/CalificacionesCualitativasServicio';
import CalificacionesCuantitativasServicio from './servicios/CalificacionesCuantitativasServicio';
import CursoServicio from './servicios/CursoServicio';
import EstudianteCursoServicio from './servicios/EstudianteCursoServicio';
import EstudianteCursoParaleloServicio from './servicios/EstudianteCursoParaleloServicio';
import EstudianteServicio from './servicios/EstudianteServicio';
import ParaleloServicio from './servicios/ParaleloServicio';
import ParametroServicio from './servicios/ParametroServicio';
import ParcialServicio from './servicios/ParcialServicio';
import PeriodoServicio from './servicios/PeriodoServicio';
import ProfesorAsignaturaParaleloServicio from './servicios/ProfesorAsignaturaParaleloServicio';
import UsuarioServicio from './servicios/UsuarioServicio';
import UsuarioProfesorServicio from './servicios/UsuarioProfesorServicio';
import EscalasReferencialesCalificacionesServicio from './servicios/EscalasReferencialesCalificacionesServicio';
import ReporteServicio from './servicios/ReporteServicio';
import AutentificacionServicio from './servicios/AutentificacionServicio';

const { SERVER_PORT, SERVER_URL, PAGE_URL } = process.env;
const app = express();
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: PAGE_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Asegúrate de habilitar las credenciales
};
app.use(cors(corsOptions));

app.use('/api', AutentificacionServicio);
app.use('/api', AnioLectivoServicio);
app.use('/api', AreaServicio);
app.use('/api', AsignaturaServicio);
app.use('/api', CalificacionesCualitativasServicio);
app.use('/api', CalificacionesCuantitativasServicio);
app.use('/api', CursoServicio);
app.use('/api', EstudianteServicio);
app.use('/api', EstudianteCursoParaleloServicio);
app.use('/api', EstudianteCursoServicio);
app.use('/api', ParaleloServicio);
app.use('/api', ParametroServicio);
app.use('/api', ParcialServicio);
app.use('/api', PeriodoServicio);
app.use('/api', ProfesorAsignaturaParaleloServicio);
app.use('/api', UsuarioProfesorServicio);
app.use('/api', UsuarioServicio);
app.use('/api', EscalasReferencialesCalificacionesServicio);
app.use('/api', ReporteServicio);

app.listen(SERVER_PORT, () => {
  console.log(`Servidor iniciado url consumo: ${SERVER_URL}:${SERVER_PORT}/api`);
});
