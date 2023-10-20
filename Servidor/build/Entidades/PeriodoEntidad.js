"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Periodo {
    constructor(PRD_ID, PRD_NOM, PRD_TIPO, AL_ID, ESTADO, CREADOR_ID, FECHA_CREACION) {
        this.PRD_ID = PRD_ID;
        this.PRD_NOM = PRD_NOM;
        this.PRD_TIPO = PRD_TIPO;
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
        const query = `INSERT INTO periodo (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRD_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.PRD_ID);
        const query = `UPDATE periodo SET ${valoresStr.join(', ')} WHERE PRD_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.PRD_ID && !!this.PRD_NOM && !!this.PRD_TIPO && !!this.AL_ID && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
exports.default = Periodo;
