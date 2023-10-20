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
class CalificacionesParcialesNegocio {
    static getCalificacionesParciales() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = 'SELECT * FROM calificaciones_parciales';
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
                const [rows] = yield BaseDatos_1.default.execute('SELECT * FROM calificaciones_parciales WHERE CAL_ID = ?', [id]);
                if (rows.length <= 0) {
                    throw new Error('CalificacionesParciales no encontrado');
                }
                let newCalificacionesParciales = rows[0];
                return { data: newCalificacionesParciales, message: 'Encontrado' };
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static addCalificacionesParciales(calificaciones_parciales) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!calificaciones_parciales.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo CalificacionesParciales no tiene la estructura esperada.');
                }
                calificaciones_parciales.CAL_ID = (0, uuid_1.v4)(); //asigna un identificador unico
                let data = calificaciones_parciales.sqlInsert();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo agregar CalificacionesParciales');
                }
                return { data: calificaciones_parciales.CAL_ID, message: 'Se creo correctamente' }; // Retorna el ID del CalificacionesParciales
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static deleteCalificacionesParciales(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield BaseDatos_1.default.execute('delete FROM calificaciones_parciales WHERE CAL_ID = ?', [id]);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo eliminar el objeto de tipo CalificacionesParciales');
                }
                return { data: true, message: 'Objeto eliminado' };
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static updateCalificacionesParciales(calificaciones_parciales) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!calificaciones_parciales.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo CalificacionesParciales no tiene la estructura esperada.');
                }
                let data = calificaciones_parciales.sqlUpdate();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo actualizar CalificacionesParciales');
                }
                return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
}
exports.default = CalificacionesParcialesNegocio;
