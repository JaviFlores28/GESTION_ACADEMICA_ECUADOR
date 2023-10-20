"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CalificacionesPeriodo {
    constructor(CAL_ID, PRF_ASG_PRLL_ID, PRLL_EST_ID, CALIFICACION_CNTVA, CALIFICACION_CLTVA, PRD_ID, ESTADO, CREADOR_ID, FECHA_CREACION) {
        this.CAL_ID = CAL_ID;
        this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
        this.PRLL_EST_ID = PRLL_EST_ID;
        this.CALIFICACION_CNTVA = CALIFICACION_CNTVA;
        this.CALIFICACION_CLTVA = CALIFICACION_CLTVA;
        this.PRD_ID = PRD_ID;
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
        const query = `INSERT INTO calificaciones_periodo (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'CAL_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.CAL_ID);
        const query = `UPDATE calificaciones_periodo SET ${valoresStr.join(', ')} WHERE CAL_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.CAL_ID && !!this.PRF_ASG_PRLL_ID && !!this.PRLL_EST_ID && !!this.CALIFICACION_CNTVA && !!this.CALIFICACION_CLTVA && !!this.PRD_ID && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
exports.default = CalificacionesPeriodo;
