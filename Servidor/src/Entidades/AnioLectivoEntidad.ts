
class AnioLectivo {
    AL_ID: string;
    AL_NOM: string;
    AL_INICIO: Date;
    AL_FIN: Date;
    AL_POR_PRD: number;
    AL_POR_EXAM: number;
    CLFN__MIN_APR: number;
    CLFN__MIN_PERD: number;
    NUM_PRD: number;
    NUM_EXAM: number;
    NUM_PRCL: number;
    NUM_SUSP: number;
    ESTADO: string;
    CREADOR_ID: string;
    FECHA_CREACION?:Date | undefined;
    
    constructor(AL_ID: string, AL_NOM: string, AL_INICIO: Date, AL_FIN: Date, AL_POR_PRD: number, AL_POR_EXAM: number, CLFN__MIN_APR: number, CLFN__MIN_PERD: number, NUM_PRD: number, NUM_EXAM: number, NUM_PRCL: number, NUM_SUSP: number, ESTADO: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
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

    sqlInsert(): { query: string; values: any[] } {
        const propiedades: any[] = [];
        const valores: any[] = [];

        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad as keyof this];

            if (valor !== undefined && propiedad !== 'FECHA_CREACION') {
                propiedades.push(propiedad);

                if (typeof valor === 'string' || valor instanceof Date) {
                    valores.push(valor);
                } else {
                    valores.push(valor);
                }
            }
        });

        const valoresStr = propiedades.map(() => '?').join(', ');
        const propiedadesStr = propiedades.join(', ');

        const query = `INSERT INTO anio_lectivo (${propiedadesStr}) VALUES (${valoresStr});`;

        return { query, values: valores };
    }

    sqlUpdate(): { query: string; values: any[] } {
        const valoresStr: string[] = [];
        const valores: any[] = [];

        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad as keyof this];

            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'AL_ID' && propiedad !== 'CREADOR_ID' ) {
                if (typeof valor === 'string') {
                    valoresStr.push(`${propiedad} = ?`);
                    valores.push(valor);
                } else if (valor instanceof Date) {
                    const fecha = valor.toISOString().slice(0, 10);
                    valoresStr.push(`${propiedad} = ?`);
                    valores.push(fecha);
                } else {
                    valoresStr.push(`${propiedad} = ?`);
                    valores.push(valor);
                }
            }
        });
        valores.push(this.AL_ID);
        const query = `UPDATE anio_lectivo SET ${valoresStr.join(', ')} WHERE AL_ID = ?;`;
        return { query, values: valores };
    }

    isValid(): boolean {
      return !!this.AL_ID && !!this.AL_NOM && !!this.AL_INICIO && !!this.AL_FIN && !!this.AL_POR_PRD && !!this.AL_POR_EXAM && !!this.CLFN__MIN_APR && !!this.CLFN__MIN_PERD && !!this.NUM_PRD && !!this.NUM_EXAM && !!this.NUM_PRCL && !!this.NUM_SUSP && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
export default AnioLectivo;
