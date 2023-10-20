"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parametro {
    constructor(PRMT_ID, PRMT_NOM, PRMT_DESCR, PRMT_URL_IMG, ESTADO, CREADOR_ID, FECHA_CREACION) {
        this.PRMT_ID = PRMT_ID;
        this.PRMT_NOM = PRMT_NOM;
        this.PRMT_DESCR = PRMT_DESCR;
        this.PRMT_URL_IMG = PRMT_URL_IMG;
        this.ESTADO = ESTADO;
        this.CREADOR_ID = CREADOR_ID;
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
        const query = `INSERT INTO parametro (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRMT_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.PRMT_ID);
        const query = `UPDATE parametro SET ${valoresStr.join(', ')} WHERE PRMT_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.PRMT_ID && !!this.PRMT_NOM && !!this.PRMT_DESCR && !!this.PRMT_URL_IMG && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
exports.default = Parametro;
