
class ProfesorAsignaturaParalelo {
  PRF_ASG_PRLL_ID: string;
    ASG_ID: string;
    PRF_ID: string;
    PRLL_ID: string;
    ESTADO: number;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(PRF_ASG_PRLL_ID: string, ASG_ID: string, PRF_ID: string, PRLL_ID: string, ESTADO: number, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
      this.ASG_ID = ASG_ID;
      this.PRF_ID = PRF_ID;
      this.PRLL_ID = PRLL_ID;
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

  const query = `INSERT INTO profesor_asignatura_paralelo (${propiedadesStr}) VALUES (${valoresStr});`;

  return { query, values: valores };
}

    
sqlUpdate(): { query: string; values: any[] } {
  const valoresStr: string[] = [];
  const valores: any[] = [];

  // Iterar sobre las propiedades del objeto
  Object.keys(this).forEach(propiedad => {
      const valor = this[propiedad as keyof this];

      if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRF_ASG_PRLL_ID' && propiedad !== 'CREADOR_ID' ) {
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
  valores.push(this.PRF_ASG_PRLL_ID);
  const query = `UPDATE profesor_asignatura_paralelo SET ${valoresStr.join(', ')} WHERE PRF_ASG_PRLL_ID = ?;`;
  return { query, values: valores };
}

    
isValid(): boolean {
  return !!this.PRF_ASG_PRLL_ID && !!this.ASG_ID && !!this.PRF_ID && !!this.PRLL_ID && !!this.CREADOR_ID;
}

    
}
export default ProfesorAsignaturaParalelo;
