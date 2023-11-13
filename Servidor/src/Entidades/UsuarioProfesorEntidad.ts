
class UsuarioProfesorEntidad {
  DTLL_PRF_ID: string;
    PRF_FECH_INGR_INST: Date;
    PRF_FECH_INGR_MAG: Date;
    USR_ID: string;    
    constructor(DTLL_PRF_ID: string, PRF_FECH_INGR_INST: Date, PRF_FECH_INGR_MAG: Date, USR_ID: string) {
       this.DTLL_PRF_ID = DTLL_PRF_ID;
      this.PRF_FECH_INGR_INST = PRF_FECH_INGR_INST;
      this.PRF_FECH_INGR_MAG = PRF_FECH_INGR_MAG;
      this.USR_ID = USR_ID;
    }

    toArrayInsert(): any[] {
      return [this.DTLL_PRF_ID,this.PRF_FECH_INGR_INST,this.PRF_FECH_INGR_MAG,this.USR_ID];
    } 
    toArrayUpdate(): any[] {
      return [this.PRF_FECH_INGR_INST,this.PRF_FECH_INGR_MAG,this.USR_ID, this.DTLL_PRF_ID];
    }
}

export default UsuarioProfesorEntidad;
