
class Paralelo {
    PRLL_ID: string;
    PRLL_NOM: string;
    CRS_ID: string;
    AL_ID: string;
    ESTADO: string;
    CREADOR_ID: string;
    FECHA_CREACION?:Date | undefined;
    
    constructor(PRLL_ID: string, PRLL_NOM: string, CRS_ID: string, AL_ID: string, ESTADO: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
        this.PRLL_ID = PRLL_ID;
      this.PRLL_NOM = PRLL_NOM;
      this.CRS_ID = CRS_ID;
      this.AL_ID = AL_ID;
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

        const query = `INSERT INTO paralelo (${propiedadesStr}) VALUES (${valoresStr});`;

        return { query, values: valores };
    }

    sqlUpdate(): { query: string; values: any[] } {
        const valoresStr: string[] = [];
        const valores: any[] = [];

        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad as keyof this];

            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRLL_ID' && propiedad !== 'CREADOR_ID' ) {
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
        valores.push(this.PRLL_ID);
        const query = `UPDATE paralelo SET ${valoresStr.join(', ')} WHERE PRLL_ID = ?;`;
        return { query, values: valores };
    }

    isValid(): boolean {
      return !!this.PRLL_ID && !!this.PRLL_NOM && !!this.CRS_ID && !!this.AL_ID && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
export default Paralelo;
