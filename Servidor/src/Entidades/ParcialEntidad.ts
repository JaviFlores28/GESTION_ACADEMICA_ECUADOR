
class Parcial {
    PRCL_ID: string;
    PRCL_NOM: string;
    PRCL_INI: Date;
    PRCL_FIN: Date;
    ESTADO: string;
    PRCL_TIPO: string;
    PRD_ID: string;
    CREADOR_ID: string;
    FECHA_CREACION?:Date | undefined;
    
    constructor(PRCL_ID: string, PRCL_NOM: string, PRCL_INI: Date, PRCL_FIN: Date, ESTADO: string, PRCL_TIPO: string, PRD_ID: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
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

        const query = `INSERT INTO parcial (${propiedadesStr}) VALUES (${valoresStr});`;

        return { query, values: valores };
    }

    sqlUpdate(): { query: string; values: any[] } {
        const valoresStr: string[] = [];
        const valores: any[] = [];

        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad as keyof this];

            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRCL_ID' && propiedad !== 'CREADOR_ID' ) {
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
        valores.push(this.PRCL_ID);
        const query = `UPDATE parcial SET ${valoresStr.join(', ')} WHERE PRCL_ID = ?;`;
        return { query, values: valores };
    }

    isValid(): boolean {
      return !!this.PRCL_ID && !!this.PRCL_NOM && !!this.PRCL_INI && !!this.PRCL_FIN && !!this.ESTADO && !!this.PRCL_TIPO && !!this.PRD_ID && !!this.CREADOR_ID;
    }
}
export default Parcial;
