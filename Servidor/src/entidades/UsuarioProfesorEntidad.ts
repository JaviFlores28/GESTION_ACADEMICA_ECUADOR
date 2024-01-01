class UsuarioProfesorEntidad {
  USR_ID: string;
  PRF_FECH_INGR_INST: Date;
  PRF_FECH_INGR_MAG: Date;

  constructor(USR_ID: string, PRF_FECH_INGR_INST: Date, PRF_FECH_INGR_MAG: Date) {
    this.USR_ID = USR_ID;
    this.PRF_FECH_INGR_INST = PRF_FECH_INGR_INST;
    this.PRF_FECH_INGR_MAG = PRF_FECH_INGR_MAG;
  }

  toArrayInsert(): any[] {
    return [this.USR_ID, this.PRF_FECH_INGR_INST, this.PRF_FECH_INGR_MAG];
  }

  toArrayUpdate(): any[] {
    return [this.PRF_FECH_INGR_INST, this.PRF_FECH_INGR_MAG, this.USR_ID];
  }
}

export default UsuarioProfesorEntidad;
