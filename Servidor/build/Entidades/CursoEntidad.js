"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Curso {
    constructor(CRS_ID, CRS_NOM, CRS_TIPO, CRS_ORDEN, ESTADO, CREADOR_ID, FECHA_CREACION) {
        this.CRS_ID = CRS_ID;
        this.CRS_NOM = CRS_NOM;
        this.CRS_TIPO = CRS_TIPO;
        this.CRS_ORDEN = CRS_ORDEN;
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
        const query = `INSERT INTO curso (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'CRS_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.CRS_ID);
        const query = `UPDATE curso SET ${valoresStr.join(', ')} WHERE CRS_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.CRS_ID && !!this.CRS_NOM && !!this.CRS_TIPO && !!this.CRS_ORDEN && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
exports.default = Curso;
