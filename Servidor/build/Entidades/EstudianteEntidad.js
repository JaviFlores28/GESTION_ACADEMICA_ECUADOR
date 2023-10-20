"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Estudiante {
    constructor(EST_ID, EST_DNI, EST_NOM, EST_NOM2, EST_APE, EST_APE2, EST_FECH_NAC, EST_GEN, EST_PRV, EST_CAN, EST_PARR, EST_DIR, EST_NAC, EST_ETN, EST_NAC_ETN, EST_COM_ETN, EST_COD_ELE, EST_NEC_ASO_DIS, EST_NEC_NO_ASO_DIS, EST_ENF_CAT, EST_NUM_CONA, EST_INTE, EST_TV, EST_RAD, EST_PC, EST_CEL, REPR_ID, REL_EST_REP, ESTADO, CREADOR_ID, FECHA_CREACION) {
        this.EST_ID = EST_ID;
        this.EST_DNI = EST_DNI;
        this.EST_NOM = EST_NOM;
        this.EST_NOM2 = EST_NOM2;
        this.EST_APE = EST_APE;
        this.EST_APE2 = EST_APE2;
        this.EST_FECH_NAC = EST_FECH_NAC;
        this.EST_GEN = EST_GEN;
        this.EST_PRV = EST_PRV;
        this.EST_CAN = EST_CAN;
        this.EST_PARR = EST_PARR;
        this.EST_DIR = EST_DIR;
        this.EST_NAC = EST_NAC;
        this.EST_ETN = EST_ETN;
        this.EST_NAC_ETN = EST_NAC_ETN;
        this.EST_COM_ETN = EST_COM_ETN;
        this.EST_COD_ELE = EST_COD_ELE;
        this.EST_NEC_ASO_DIS = EST_NEC_ASO_DIS;
        this.EST_NEC_NO_ASO_DIS = EST_NEC_NO_ASO_DIS;
        this.EST_ENF_CAT = EST_ENF_CAT;
        this.EST_NUM_CONA = EST_NUM_CONA;
        this.EST_INTE = EST_INTE;
        this.EST_TV = EST_TV;
        this.EST_RAD = EST_RAD;
        this.EST_PC = EST_PC;
        this.EST_CEL = EST_CEL;
        this.REPR_ID = REPR_ID;
        this.REL_EST_REP = REL_EST_REP;
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
        const query = `INSERT INTO estudiante (${propiedadesStr}) VALUES (${valoresStr});`;
        return { query, values: valores };
    }
    sqlUpdate() {
        const valoresStr = [];
        const valores = [];
        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad];
            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'EST_ID' && propiedad !== 'CREADOR_ID') {
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
        valores.push(this.EST_ID);
        const query = `UPDATE estudiante SET ${valoresStr.join(', ')} WHERE EST_ID = ?;`;
        return { query, values: valores };
    }
    isValid() {
        return !!this.EST_ID && !!this.EST_DNI && !!this.EST_NOM && !!this.EST_NOM2 && !!this.EST_APE && !!this.EST_APE2 && !!this.EST_FECH_NAC && !!this.EST_GEN && !!this.EST_PRV && !!this.EST_CAN && !!this.EST_PARR && !!this.EST_DIR && !!this.EST_NAC && !!this.EST_ETN && !!this.EST_NAC_ETN && !!this.EST_COM_ETN && !!this.EST_COD_ELE && !!this.EST_NEC_ASO_DIS && !!this.EST_NEC_NO_ASO_DIS && !!this.EST_ENF_CAT && !!this.EST_NUM_CONA && !!this.EST_INTE && !!this.EST_TV && !!this.EST_RAD && !!this.EST_PC && !!this.EST_CEL && !!this.REPR_ID && !!this.REL_EST_REP && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
exports.default = Estudiante;
