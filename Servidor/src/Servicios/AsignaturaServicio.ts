
import { Router } from 'express';
const router = Router();
import AsignaturaNegocio from '../Negocio/AsignaturaNegocio';
import AsignaturaEntidad from '../Entidades/AsignaturaEntidad';

router.get('/asignatura', async (req, res) => {
   try {
    const asignatura = await AsignaturaNegocio.getAsignatura();
    res.json(asignatura);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/asignatura', async (req, res) => {
   try {
    const request = req.body;
    const asignatura = new AsignaturaEntidad(request.ASG_ID, request.ASG_NOM, request.ASG_TIPO, request.AREA_ID, request.CRS_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await AsignaturaNegocio.addAsignatura(asignatura);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/asignatura', async (req, res) => {
  try {
    const request = req.body;
    const asignatura = new AsignaturaEntidad(request.ASG_ID, request.ASG_NOM, request.ASG_TIPO, request.AREA_ID, request.CRS_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await AsignaturaNegocio.updateAsignatura(asignatura);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/asignatura/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await AsignaturaNegocio.deleteAsignatura(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/asignatura/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await AsignaturaNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
