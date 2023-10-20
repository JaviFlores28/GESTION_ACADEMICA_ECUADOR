"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AnioLectivoServicio_1 = __importDefault(require("./Servicios/AnioLectivoServicio"));
const AreaServicio_1 = __importDefault(require("./Servicios/AreaServicio"));
const AsignaturaServicio_1 = __importDefault(require("./Servicios/AsignaturaServicio"));
const CalificacionesParcialesServicio_1 = __importDefault(require("./Servicios/CalificacionesParcialesServicio"));
const CalificacionesPeriodoServicio_1 = __importDefault(require("./Servicios/CalificacionesPeriodoServicio"));
const CursoServicio_1 = __importDefault(require("./Servicios/CursoServicio"));
const EstudianteServicio_1 = __importDefault(require("./Servicios/EstudianteServicio"));
const MatriculaServicio_1 = __importDefault(require("./Servicios/MatriculaServicio"));
const ParaleloEstudianteServicio_1 = __importDefault(require("./Servicios/ParaleloEstudianteServicio"));
const ParaleloServicio_1 = __importDefault(require("./Servicios/ParaleloServicio"));
const ParametroServicio_1 = __importDefault(require("./Servicios/ParametroServicio"));
const ParcialServicio_1 = __importDefault(require("./Servicios/ParcialServicio"));
const PeriodoServicio_1 = __importDefault(require("./Servicios/PeriodoServicio"));
const ProfesorAsignaturaParaleloServicio_1 = __importDefault(require("./Servicios/ProfesorAsignaturaParaleloServicio"));
const ProfesorServicio_1 = __importDefault(require("./Servicios/ProfesorServicio"));
const UsuarioServicio_1 = __importDefault(require("./Servicios/UsuarioServicio"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const { SERVER_PORT, SERVER_URL } = process.env;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', AnioLectivoServicio_1.default);
app.use('/api', AreaServicio_1.default);
app.use('/api', AsignaturaServicio_1.default);
app.use('/api', CalificacionesParcialesServicio_1.default);
app.use('/api', CalificacionesPeriodoServicio_1.default);
app.use('/api', CursoServicio_1.default);
app.use('/api', EstudianteServicio_1.default);
app.use('/api', MatriculaServicio_1.default);
app.use('/api', ParaleloEstudianteServicio_1.default);
app.use('/api', ParaleloServicio_1.default);
app.use('/api', ParametroServicio_1.default);
app.use('/api', ParcialServicio_1.default);
app.use('/api', PeriodoServicio_1.default);
app.use('/api', ProfesorAsignaturaParaleloServicio_1.default);
app.use('/api', ProfesorServicio_1.default);
app.use('/api', UsuarioServicio_1.default);
app.listen(SERVER_PORT, () => {
    console.log(`Servidor iniciado url consumo: ${SERVER_URL}:${SERVER_PORT}/api`);
});
