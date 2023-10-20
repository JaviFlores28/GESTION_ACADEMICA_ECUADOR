"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Asignatura {
    constructor(ASG_ID, ASG_NOM, ASG_TIPO, AREA_ID, CRS_ID, ESTADO, CREADOR_ID, FECHA_CREACION) {
        this.ASG_ID = ASG_ID;
        this.ASG_NOM = ASG_NOM;
        this.ASG_TIPO = ASG_TIPO;
        this.AREA_ID = AREA_ID;
        this.CRS_ID = CRS_ID;
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
        const query = `INSERT INTO asignatura (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'ASG_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.ASG_ID);
        const query = `UPDATE asignatura SET ${valoresStr.join(', ')} WHERE ASG_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.ASG_ID && !!this.ASG_NOM && !!this.ASG_TIPO && !!this.AREA_ID && !!this.CRS_ID && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
exports.default = Asignatura;
