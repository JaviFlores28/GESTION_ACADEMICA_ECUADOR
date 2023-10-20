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
const Funciones_1 = __importDefault(require("../Modelos/Funciones"));
const uuid_1 = require("uuid");
class UsuarioNegocio {
    static getUsuario() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = 'SELECT * FROM usuario';
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
                const [rows] = yield BaseDatos_1.default.execute('SELECT * FROM usuario WHERE USR_ID = ?', [id]);
                if (rows.length <= 0) {
                    throw new Error('Usuario no encontrado');
                }
                let newUsuario = rows[0];
                newUsuario.USR_PSWD = 'pswd';
                return { data: newUsuario, message: 'Encontrado' };
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static addUsuario(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!usuario.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo Usuario no tiene la estructura esperada.');
                }
                usuario.USR_ID = (0, uuid_1.v4)(); //asigna un identificador unico
                usuario.USR_PSWD = Funciones_1.default.encrypt(usuario.USR_PSWD); // cifra la contraseña en caso de ser usuario
                let data = usuario.sqlInsert();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo agregar Usuario');
                }
                return { data: usuario.USR_ID, message: 'Se creo correctamente' }; // Retorna el ID del Usuario
            }
            catch (error) {
                return { data: null, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static deleteUsuario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield BaseDatos_1.default.execute('delete FROM usuario WHERE USR_ID = ?', [id]);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo eliminar el objeto de tipo Usuario');
                }
                return { data: true, message: 'Objeto eliminado' };
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static updateUsuario(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!usuario.isValid()) { //validar estructura del objeto
                    throw new Error('Objeto de tipo Usuario no tiene la estructura esperada.');
                }
                let data = usuario.sqlUpdate();
                const [result] = yield BaseDatos_1.default.execute(data.query, data.values);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo actualizar Usuario');
                }
                return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static updatePswdUsuario(id, pswdOld, pswdNew) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: objeto, message } = yield this.searchById(id);
                if (!objeto) {
                    throw new Error(message);
                }
                let pswdUser = Funciones_1.default.decrypt(objeto.USR_PSWD);
                if (!this.pswdValid(pswdOld, pswdUser)) {
                    throw new Error('Contraseña actual incorrecta.');
                }
                let data = 'UPDATE usuario SET USR_PSWD=? WHERE USR_ID = ?';
                pswdNew = Funciones_1.default.encrypt(pswdNew);
                const [result] = yield BaseDatos_1.default.execute(data, [pswdNew, id]);
                if (result.affectedRows !== 1) {
                    throw new Error('No se pudo actualizar el objeto de tipo Usuario.');
                }
                return { data: true, message: 'Campos actualizados para el objeto de tipo Usuario.' }; // Retorna true si se pudo actualizar
            }
            catch (error) {
                return { data: false, message: error.message }; // Retorna el mensaje del error
            }
        });
    }
    static loginUsuario(usuario, pswd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield BaseDatos_1.default.execute('SELECT * FROM usuario WHERE USUARIO = ?', [usuario]);
                if (rows.length <= 0) {
                    throw new Error('Usuario no encontrado');
                }
                const pswdDecrypt = Funciones_1.default.decrypt(rows[0].USR_PSWD);
                if (!this.pswdValid(pswdDecrypt, pswd)) {
                    throw new Error('Contraseña incorrecta');
                }
                let newUsuario = rows[0];
                newUsuario.USR_PSWD = 'pswd';
                return { data: newUsuario, message: 'Usuario Valido' };
            }
            catch (error) {
                return { data: null, message: error.message }; // Devuelve una Promise rechazada con el error
            }
        });
    }
    static pswdValid(pswdInit, pswdSent) {
        if (pswdInit === pswdSent) {
            return true;
        }
        return false;
    }
}
exports.default = UsuarioNegocio;
