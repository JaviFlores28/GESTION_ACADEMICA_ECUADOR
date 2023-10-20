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
class ProfesorNegocio {
    static getProfesor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = 'SELECT * FROM profesor';
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
                const [rows] = yield BaseDatos_1.default.execute('SELECT * FROM profesor WHERE PRF_ID = ?', [id]);
                if (rows.length <= 0) {
                    throw new Error('Profesor no encontrado');
                }
                let newProfesor = rows[0];
                return { data: newProfesor, message: 'Encontrado' };
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static addProfesor(profesor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!profesor.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo Profesor no tiene la estructura esperada.');
                }
                profesor.PRF_ID = (0, uuid_1.v4)(); //asigna un identificador unico
                let data = profesor.sqlInsert();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo agregar Profesor');
                }
                return { data: profesor.PRF_ID, message: 'Se creo correctamente' }; // Retorna el ID del Profesor
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static deleteProfesor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield BaseDatos_1.default.execute('delete FROM profesor WHERE PRF_ID = ?', [id]);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo eliminar el objeto de tipo Profesor');
                }
                return { data: true, message: 'Objeto eliminado' };
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static updateProfesor(profesor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!profesor.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo Profesor no tiene la estructura esperada.');
                }
                let data = profesor.sqlUpdate();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo actualizar Profesor');
                }
                return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
}
exports.default = ProfesorNegocio;
