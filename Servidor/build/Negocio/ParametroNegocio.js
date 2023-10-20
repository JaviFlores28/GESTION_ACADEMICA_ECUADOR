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
class ParametroNegocio {
    static getParametro() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = 'SELECT * FROM parametro';
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
                const [rows] = yield BaseDatos_1.default.execute('SELECT * FROM parametro WHERE PRMT_ID = ?', [id]);
                if (rows.length <= 0) {
                    throw new Error('Parametro no encontrado');
                }
                let newParametro = rows[0];
                return { data: newParametro, message: 'Encontrado' };
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static addParametro(parametro) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!parametro.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo Parametro no tiene la estructura esperada.');
                }
                parametro.PRMT_ID = (0, uuid_1.v4)(); //asigna un identificador unico
                let data = parametro.sqlInsert();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo agregar Parametro');
                }
                return { data: parametro.PRMT_ID, message: 'Se creo correctamente' }; // Retorna el ID del Parametro
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static deleteParametro(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield BaseDatos_1.default.execute('delete FROM parametro WHERE PRMT_ID = ?', [id]);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo eliminar el objeto de tipo Parametro');
                }
                return { data: true, message: 'Objeto eliminado' };
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static updateParametro(parametro) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!parametro.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo Parametro no tiene la estructura esperada.');
                }
                let data = parametro.sqlUpdate();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo actualizar Parametro');
                }
                return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
}
exports.default = ParametroNegocio;
