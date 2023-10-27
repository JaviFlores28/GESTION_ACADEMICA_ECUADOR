
class ProfesorAsignaturaParalelo {
  PRF_ASG_PRLL_ID: string;
    ASG_ID: string;
    PRF_ID: string;
    PRLL_ID: string;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(PRF_ASG_PRLL_ID: string, ASG_ID: string, PRF_ID: string, PRLL_ID: string, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
      this.ASG_ID = ASG_ID;
      this.PRF_ID = PRF_ID;
      this.PRLL_ID = PRLL_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default ProfesorAsignaturaParalelo;
