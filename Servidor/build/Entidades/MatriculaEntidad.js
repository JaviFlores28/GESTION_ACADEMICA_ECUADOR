"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Matricula {
    constructor(MTR_ID, CRS_ID, EST_ID, ESTADO, PASE, CREADOR_ID, FECHA_CREACION) {
        this.MTR_ID = MTR_ID;
        this.CRS_ID = CRS_ID;
        this.EST_ID = EST_ID;
        this.ESTADO = ESTADO;
        this.PASE = PASE;
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
        const query = `INSERT INTO matricula (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'MTR_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.MTR_ID);
        const query = `UPDATE matricula SET ${valoresStr.join(', ')} WHERE MTR_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.MTR_ID && !!this.CRS_ID && !!this.EST_ID && !!this.ESTADO && !!this.PASE && !!this.CREADOR_ID;
    }
}
exports.default = Matricula;
