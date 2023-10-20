"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Usuario {
    constructor(USR_ID, USR_DNI, USR_NOM, USR_NOM2, USR_APE, USR_APE2, USR_DIR, USR_TEL, USR_CEL, USR_EMAIL, USR_FECH_NAC, USR_GEN, USUARIO, USR_PSWD, ROL_PRF, ROL_REPR, ROL_ADMIN, ESTADO, FECHA_CREACION) {
        this.USR_ID = USR_ID;
        this.USR_DNI = USR_DNI;
        this.USR_NOM = USR_NOM;
        this.USR_NOM2 = USR_NOM2;
        this.USR_APE = USR_APE;
        this.USR_APE2 = USR_APE2;
        this.USR_DIR = USR_DIR;
        this.USR_TEL = USR_TEL;
        this.USR_CEL = USR_CEL;
        this.USR_EMAIL = USR_EMAIL;
        this.USR_FECH_NAC = USR_FECH_NAC;
        this.USR_GEN = USR_GEN;
        this.USUARIO = USUARIO;
        this.USR_PSWD = USR_PSWD;
        this.ROL_PRF = ROL_PRF;
        this.ROL_REPR = ROL_REPR;
        this.ROL_ADMIN = ROL_ADMIN;
        this.ESTADO = ESTADO;
        this.FECHA_CREACION = FECHA_CREACION;
    }
    sqlInsert() {
        const propiedades = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION') {
                propiedades.push(propiedad);
                if (typeof valor === 'string' || valor instanceof Date) {
                    valores.push(valor);
                }
                else {
                    valores.push(valor);
                }
            }
        });
        const valoresStr = propiedades.map(() => '?').join(', ');
        const propiedadesStr = propiedades.join(', ');
        const query = `INSERT INTO usuario (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'USR_ID' && propiedad !== 'CREADOR_ID' && propiedad !== 'USR_PSWD') {
                if (typeof valor === 'string') {
                    valoresStr.push(`${propiedad} = ?`);
                    valores.push(valor);
                }
                else if (valor instanceof Date) {
                    const fecha = valor.toISOString().slice(0, 10);
                    valoresStr.push(`${propiedad} = ?`);
                    valores.push(fecha);
                }
                else {
                    valoresStr.push(`${propiedad} = ?`);
                    valores.push(valor);
                }
            }
        });
        valores.push(this.USR_ID);
        const query = `UPDATE usuario SET ${valoresStr.join(', ')} WHERE USR_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.USR_ID && !!this.USR_DNI && !!this.USR_NOM && !!this.USR_NOM2 && !!this.USR_APE && !!this.USR_APE2 && !!this.USR_DIR && !!this.USR_TEL && !!this.USR_CEL && !!this.USR_EMAIL && !!this.USR_FECH_NAC && !!this.USR_GEN && !!this.USUARIO && !!this.USR_PSWD && !!this.ROL_PRF && !!this.ROL_REPR && !!this.ROL_ADMIN && !!this.ESTADO;
    }
}
exports.default = Usuario;
