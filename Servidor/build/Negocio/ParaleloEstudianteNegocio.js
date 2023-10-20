"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDatos_1 = __importDefault(require("../Datos/BaseDatos"));
const uuid_1 = require("uuid");
class ParaleloEstudianteNegocio {
    static getParaleloEstudiante() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = 'SELECT * FROM paralelo_estudiante';
                const [rows] = yield BaseDatos_1.default.execute(data);
                return { data: rows, message: '' };
            }
            catch (error) {
                return { data: [], message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static searchById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield BaseDatos_1.default.execute('SELECT * FROM paralelo_estudiante WHERE PRLL_EST_ID = ?', [id]);
                if (rows.length <= 0) {
                    throw new Error('ParaleloEstudiante no encontrado');
                }
                let newParaleloEstudiante = rows[0];
                return { data: newParaleloEstudiante, message: 'Encontrado' };
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static addParaleloEstudiante(paralelo_estudiante) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!paralelo_estudiante.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo ParaleloEstudiante no tiene la estructura esperada.');
                }
                paralelo_estudiante.PRLL_EST_ID = (0, uuid_1.v4)(); //asigna un identificador unico
                let data = paralelo_estudiante.sqlInsert();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo agregar ParaleloEstudiante');
                }
                return { data: paralelo_estudiante.PRLL_EST_ID, message: 'Se creo correctamente' }; // Retorna el ID del ParaleloEstudiante
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static deleteParaleloEstudiante(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield BaseDatos_1.default.execute('delete FROM paralelo_estudiante WHERE PRLL_EST_ID = ?', [id]);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo eliminar el objeto de tipo ParaleloEstudiante');
                }
                return { data: true, message: 'Objeto eliminado' };
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static updateParaleloEstudiante(paralelo_estudiante) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!paralelo_estudiante.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo ParaleloEstudiante no tiene la estructura esperada.');
                }
                let data = paralelo_estudiante.sqlUpdate();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo actualizar ParaleloEstudiante');
                }
                return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
}
exports.default = ParaleloEstudianteNegocio;
