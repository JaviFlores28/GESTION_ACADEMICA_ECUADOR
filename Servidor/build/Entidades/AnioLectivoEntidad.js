"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AnioLectivo {
    constructor(AL_ID, AL_NOM, AL_INICIO, AL_FIN, AL_POR_PRD, AL_POR_EXAM, CLFN__MIN_APR, CLFN__MIN_PERD, NUM_PRD, NUM_EXAM, NUM_PRCL, NUM_SUSP, ESTADO, CREADOR_ID, FECHA_CREACION) {
        this.AL_ID = AL_ID;
        this.AL_NOM = AL_NOM;
        this.AL_INICIO = AL_INICIO;
        this.AL_FIN = AL_FIN;
        this.AL_POR_PRD = AL_POR_PRD;
        this.AL_POR_EXAM = AL_POR_EXAM;
        this.CLFN__MIN_APR = CLFN__MIN_APR;
        this.CLFN__MIN_PERD = CLFN__MIN_PERD;
        this.NUM_PRD = NUM_PRD;
        this.NUM_EXAM = NUM_EXAM;
        this.NUM_PRCL = NUM_PRCL;
        this.NUM_SUSP = NUM_SUSP;
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
        const query = `INSERT INTO anio_lectivo (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'AL_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.AL_ID);
        const query = `UPDATE anio_lectivo SET ${valoresStr.join(', ')} WHERE AL_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.AL_ID && !!this.AL_NOM && !!this.AL_INICIO && !!this.AL_FIN && !!this.AL_POR_PRD && !!this.AL_POR_EXAM && !!this.CLFN__MIN_APR && !!this.CLFN__MIN_PERD && !!this.NUM_PRD && !!this.NUM_EXAM && !!this.NUM_PRCL && !!this.NUM_SUSP && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
exports.default = AnioLectivo;
