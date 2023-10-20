"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Paralelo {
    constructor(PRLL_ID, PRLL_NOM, CRS_ID, AL_ID, ESTADO, CREADOR_ID, FECHA_CREACION) {
        this.PRLL_ID = PRLL_ID;
        this.PRLL_NOM = PRLL_NOM;
        this.CRS_ID = CRS_ID;
        this.AL_ID = AL_ID;
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
        const query = `INSERT INTO paralelo (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRLL_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.PRLL_ID);
        const query = `UPDATE paralelo SET ${valoresStr.join(', ')} WHERE PRLL_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.PRLL_ID && !!this.PRLL_NOM && !!this.CRS_ID && !!this.AL_ID && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
exports.default = Paralelo;
