
import { Router } from 'express';
const router = Router();
import CalificacionesParcialesNegocio from '../Negocio/CalificacionesParcialesNegocio';
import CalificacionesParcialesEntidad from '../Entidades/CalificacionesParcialesEntidad';

router.get('/calificacionesparciales', async (req, res) => {
   try {
    const calificaciones_parciales = await CalificacionesParcialesNegocio.getCalificacionesParciales();
    res.json(calificaciones_parciales);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/calificacionesparciales', async (req, res) => {
   try {
    const request = req.body;
    const calificaciones_parciales = new CalificacionesParcialesEntidad(request.CAL_ID, request.PRF_ASG_PRLL_ID, request.PRLL_EST_ID, request.PRCL_ID, request.CALIFICACION, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await CalificacionesParcialesNegocio.addCalificacionesParciales(calificaciones_parciales);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/calificacionesparciales', async (req, res) => {
  try {
    const request = req.body;
    const calificaciones_parciales = new CalificacionesParcialesEntidad(request.CAL_ID, request.PRF_ASG_PRLL_ID, request.PRLL_EST_ID, request.PRCL_ID, request.CALIFICACION, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await CalificacionesParcialesNegocio.updateCalificacionesParciales(calificaciones_parciales);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/calificacionesparciales/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await CalificacionesParcialesNegocio.deleteCalificacionesParciales(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/calificacionesparciales/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await CalificacionesParcialesNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
