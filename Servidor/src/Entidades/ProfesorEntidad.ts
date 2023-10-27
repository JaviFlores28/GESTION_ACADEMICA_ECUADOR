
class Profesor {
  PRF_ID: string;
    PRF_FECH_INGR_INST: Date;
    PRF_FECH_INGR_MAG: Date;
    USR_ID: string;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(PRF_ID: string, PRF_FECH_INGR_INST: Date, PRF_FECH_INGR_MAG: Date, USR_ID: string, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.PRF_ID = PRF_ID;
      this.PRF_FECH_INGR_INST = PRF_FECH_INGR_INST;
      this.PRF_FECH_INGR_MAG = PRF_FECH_INGR_MAG;
      this.USR_ID = USR_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default Profesor;
