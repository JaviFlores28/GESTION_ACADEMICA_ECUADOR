import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import AnioLectivoServicio from './Servicios/AnioLectivoServicio';
import AreaServicio from './Servicios/AreaServicio';
import AsignaturaServicio from './Servicios/AsignaturaServicio';
import CalificacionesCualitativasServicio from './Servicios/CalificacionesCualitativasServicio';
import CalificacionesCuantitativasServicio from './Servicios/CalificacionesCuantitativasServicio';
import CursoServicio from './Servicios/CursoServicio';
import EstudianteCursoServicio from './Servicios/EstudianteCursoServicio';
import EstudianteCursoParaleloServicio from './Servicios/EstudianteCursoParaleloServicio';
import EstudianteServicio from './Servicios/EstudianteServicio';
import ParaleloServicio from './Servicios/ParaleloServicio';
import ParametroServicio from './Servicios/ParametroServicio';
import ParcialServicio from './Servicios/ParcialServicio';
import PeriodoServicio from './Servicios/PeriodoServicio';
import ProfesorAsignaturaParaleloServicio from './Servicios/ProfesorAsignaturaParaleloServicio';
import UsuarioServicio from './Servicios/UsuarioServicio';
import UsuarioProfesorServicio from './Servicios/UsuarioProfesorServicio';

dotenv.config();
const { SERVER_PORT, SERVER_URL, PAGE_URL } = process.env;
const app = express();
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: PAGE_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

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

app.listen(SERVER_PORT, () => {
  console.log(`Servidor iniciado url consumo: ${SERVER_URL}:${SERVER_PORT}/api`);
});
