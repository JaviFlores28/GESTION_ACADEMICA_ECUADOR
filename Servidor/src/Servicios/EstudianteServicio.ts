
import { Router } from 'express';
const router = Router();
import EstudianteNegocio from '../Negocio/EstudianteNegocio';
import EstudianteEntidad from '../Entidades/EstudianteEntidad';

router.get('/estudiante', async (req, res) => {
   try {
    const estudiante = await EstudianteNegocio.getEstudiante();
    res.json(estudiante);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/estudianteEnabled', async (req, res) => {
   try {
    const estudiante = await EstudianteNegocio.getEnabledEstudiante();
    res.json(estudiante);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/estudiante', async (req, res) => {
   try {
    const request = req.body;
    const estudiante = new EstudianteEntidad(request.EST_ID, request.EST_DNI, request.EST_NOM, request.EST_NOM2, request.EST_APE, request.EST_APE2, request.EST_FECH_NAC, request.EST_GEN, request.EST_PRV, request.EST_CAN, request.EST_PARR, request.EST_DIR, request.EST_NAC, request.EST_ETN, request.EST_NAC_ETN, request.EST_COM_ETN, request.EST_COD_ELE, request.EST_NEC_ASO_DIS, request.EST_NEC_NO_ASO_DIS, request.EST_ENF_CAT, request.EST_NUM_CONA, request.EST_INTE, request.EST_TV, request.EST_RAD, request.EST_PC, request.EST_CEL, request.REPR_ID, request.REL_EST_REP, request.ESTADO, request.CREADOR_ID);
    const response = await EstudianteNegocio.addEstudiante(estudiante);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/estudiante', async (req, res) => {
  try {
    const request = req.body;
    const estudiante = new EstudianteEntidad(request.EST_ID, request.EST_DNI, request.EST_NOM, request.EST_NOM2, request.EST_APE, request.EST_APE2, request.EST_FECH_NAC, request.EST_GEN, request.EST_PRV, request.EST_CAN, request.EST_PARR, request.EST_DIR, request.EST_NAC, request.EST_ETN, request.EST_NAC_ETN, request.EST_COM_ETN, request.EST_COD_ELE, request.EST_NEC_ASO_DIS, request.EST_NEC_NO_ASO_DIS, request.EST_ENF_CAT, request.EST_NUM_CONA, request.EST_INTE, request.EST_TV, request.EST_RAD, request.EST_PC, request.EST_CEL, request.REPR_ID, request.REL_EST_REP, request.ESTADO, request.CREADOR_ID);
    const response = await EstudianteNegocio.updateEstudiante(estudiante);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/estudiante/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await EstudianteNegocio.deleteEstudiante(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/estudiante/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await EstudianteNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
