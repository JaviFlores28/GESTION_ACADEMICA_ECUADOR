
class Profesor {
    PRF_ID: string;
    PRF_FECH_INGR_INST: Date;
    PRF_FECH_INGR_MAG: Date;
    USR_ID: string;
    ESTADO: string;
    CREADOR_ID: string;
    FECHA_CREACION?:Date | undefined;
    
    constructor(PRF_ID: string, PRF_FECH_INGR_INST: Date, PRF_FECH_INGR_MAG: Date, USR_ID: string, ESTADO: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
        this.PRF_ID = PRF_ID;
      this.PRF_FECH_INGR_INST = PRF_FECH_INGR_INST;
      this.PRF_FECH_INGR_MAG = PRF_FECH_INGR_MAG;
      this.USR_ID = USR_ID;
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

        const query = `INSERT INTO profesor (${propiedadesStr}) VALUES (${valoresStr});`;

        return { query, values: valores };
    }

    sqlUpdate(): { query: string; values: any[] } {
        const valoresStr: string[] = [];
        const valores: any[] = [];

        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad as keyof this];

            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRF_ID' && propiedad !== 'CREADOR_ID' ) {
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
        valores.push(this.PRF_ID);
        const query = `UPDATE profesor SET ${valoresStr.join(', ')} WHERE PRF_ID = ?;`;
        return { query, values: valores };
    }

    isValid(): boolean {
      return !!this.PRF_ID && !!this.PRF_FECH_INGR_INST && !!this.PRF_FECH_INGR_MAG && !!this.USR_ID && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
export default Profesor;
