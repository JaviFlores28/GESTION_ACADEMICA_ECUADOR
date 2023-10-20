"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Profesor {
    constructor(PRF_ID, PRF_FECH_INGR_INST, PRF_FECH_INGR_MAG, USR_ID, ESTADO, CREADOR_ID, FECHA_CREACION) {
        this.PRF_ID = PRF_ID;
        this.PRF_FECH_INGR_INST = PRF_FECH_INGR_INST;
        this.PRF_FECH_INGR_MAG = PRF_FECH_INGR_MAG;
        this.USR_ID = USR_ID;
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
        const query = `INSERT INTO profesor (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRF_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.PRF_ID);
        const query = `UPDATE profesor SET ${valoresStr.join(', ')} WHERE PRF_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.PRF_ID && !!this.PRF_FECH_INGR_INST && !!this.PRF_FECH_INGR_MAG && !!this.USR_ID && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
exports.default = Profesor;
