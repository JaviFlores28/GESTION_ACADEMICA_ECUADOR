"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parcial {
    constructor(PRCL_ID, PRCL_NOM, PRCL_INI, PRCL_FIN, ESTADO, PRCL_TIPO, PRD_ID, CREADOR_ID, FECHA_CREACION) {
        this.PRCL_ID = PRCL_ID;
        this.PRCL_NOM = PRCL_NOM;
        this.PRCL_INI = PRCL_INI;
        this.PRCL_FIN = PRCL_FIN;
        this.ESTADO = ESTADO;
        this.PRCL_TIPO = PRCL_TIPO;
        this.PRD_ID = PRD_ID;
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
        const query = `INSERT INTO parcial (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRCL_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.PRCL_ID);
        const query = `UPDATE parcial SET ${valoresStr.join(', ')} WHERE PRCL_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.PRCL_ID && !!this.PRCL_NOM && !!this.PRCL_INI && !!this.PRCL_FIN && !!this.ESTADO && !!this.PRCL_TIPO && !!this.PRD_ID && !!this.CREADOR_ID;
    }
}
exports.default = Parcial;
