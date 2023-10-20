
class CalificacionesParciales {
    CAL_ID: string;
    PRF_ASG_PRLL_ID: string;
    PRLL_EST_ID: string;
    PRCL_ID: string;
    CALIFICACION: number;
    ESTADO: string;
    CREADOR_ID: string;
    FECHA_CREACION?:Date | undefined;
    
    constructor(CAL_ID: string, PRF_ASG_PRLL_ID: string, PRLL_EST_ID: string, PRCL_ID: string, CALIFICACION: number, ESTADO: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
        this.CAL_ID = CAL_ID;
      this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
      this.PRLL_EST_ID = PRLL_EST_ID;
      this.PRCL_ID = PRCL_ID;
      this.CALIFICACION = CALIFICACION;
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

        const query = `INSERT INTO calificaciones_parciales (${propiedadesStr}) VALUES (${valoresStr});`;

        return { query, values: valores };
    }

    sqlUpdate(): { query: string; values: any[] } {
        const valoresStr: string[] = [];
        const valores: any[] = [];

        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad as keyof this];

            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'CAL_ID' && propiedad !== 'CREADOR_ID' ) {
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
        valores.push(this.CAL_ID);
        const query = `UPDATE calificaciones_parciales SET ${valoresStr.join(', ')} WHERE CAL_ID = ?;`;
        return { query, values: valores };
    }

    isValid(): boolean {
      return !!this.CAL_ID && !!this.PRF_ASG_PRLL_ID && !!this.PRLL_EST_ID && !!this.PRCL_ID && !!this.CALIFICACION && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
export default CalificacionesParciales;
