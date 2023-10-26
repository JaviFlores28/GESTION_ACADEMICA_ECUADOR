
import { Router } from 'express';
const router = Router();
import ProfesorNegocio from '../Negocio/ProfesorNegocio';
import ProfesorEntidad from '../Entidades/ProfesorEntidad';

router.get('/profesor', async (req, res) => {
   try {
    const profesor = await ProfesorNegocio.getProfesor();
    res.json(profesor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/profesorEnabled', async (req, res) => {
   try {
    const profesor = await ProfesorNegocio.getEnabledProfesor();
    res.json(profesor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/profesor', async (req, res) => {
   try {
    const request = req.body;
    const profesor = new ProfesorEntidad(request.PRF_ID, request.PRF_FECH_INGR_INST, request.PRF_FECH_INGR_MAG, request.USR_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await ProfesorNegocio.addProfesor(profesor);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profesor', async (req, res) => {
  try {
    const request = req.body;
    const profesor = new ProfesorEntidad(request.PRF_ID, request.PRF_FECH_INGR_INST, request.PRF_FECH_INGR_MAG, request.USR_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await ProfesorNegocio.updateProfesor(profesor);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/profesor/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ProfesorNegocio.deleteProfesor(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profesor/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ProfesorNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
