
class Curso {
    CRS_ID: string;
    CRS_NOM: string;
    CRS_TIPO: string;
    CRS_ORDEN: number;
    ESTADO: string;
    CREADOR_ID: string;
    FECHA_CREACION?:Date | undefined;
    
    constructor(CRS_ID: string, CRS_NOM: string, CRS_TIPO: string, CRS_ORDEN: number, ESTADO: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
        this.CRS_ID = CRS_ID;
      this.CRS_NOM = CRS_NOM;
      this.CRS_TIPO = CRS_TIPO;
      this.CRS_ORDEN = CRS_ORDEN;
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

        const query = `INSERT INTO curso (${propiedadesStr}) VALUES (${valoresStr});`;

        return { query, values: valores };
    }

    sqlUpdate(): { query: string; values: any[] } {
        const valoresStr: string[] = [];
        const valores: any[] = [];

        // Iterar sobre las propiedades del objeto
        Object.keys(this).forEach(propiedad => {
            const valor = this[propiedad as keyof this];

            if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'CRS_ID' && propiedad !== 'CREADOR_ID' ) {
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
        valores.push(this.CRS_ID);
        const query = `UPDATE curso SET ${valoresStr.join(', ')} WHERE CRS_ID = ?;`;
        return { query, values: valores };
    }

    isValid(): boolean {
      return !!this.CRS_ID && !!this.CRS_NOM && !!this.CRS_TIPO && !!this.CRS_ORDEN && !!this.ESTADO && !!this.CREADOR_ID;
    }
}
export default Curso;
