
import { Router } from 'express';
const router = Router();
import CalificacionesPeriodoNegocio from '../Negocio/CalificacionesPeriodoNegocio';
import CalificacionesPeriodoEntidad from '../Entidades/CalificacionesPeriodoEntidad';

router.get('/calificacionesperiodo', async (req, res) => {
   try {
    const calificaciones_periodo = await CalificacionesPeriodoNegocio.getCalificacionesPeriodo();
    res.json(calificaciones_periodo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/calificacionesperiodoEnabled', async (req, res) => {
   try {
    const calificaciones_periodo = await CalificacionesPeriodoNegocio.getEnabledCalificacionesPeriodo();
    res.json(calificaciones_periodo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/calificacionesperiodo', async (req, res) => {
   try {
    const request = req.body;
    const calificaciones_periodo = new CalificacionesPeriodoEntidad(request.CAL_ID, request.PRF_ASG_PRLL_ID, request.PRLL_EST_ID, request.CALIFICACION_CNTVA, request.CALIFICACION_CLTVA, request.PRD_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await CalificacionesPeriodoNegocio.addCalificacionesPeriodo(calificaciones_periodo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/calificacionesperiodo', async (req, res) => {
  try {
    const request = req.body;
    const calificaciones_periodo = new CalificacionesPeriodoEntidad(request.CAL_ID, request.PRF_ASG_PRLL_ID, request.PRLL_EST_ID, request.CALIFICACION_CNTVA, request.CALIFICACION_CLTVA, request.PRD_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await CalificacionesPeriodoNegocio.updateCalificacionesPeriodo(calificaciones_periodo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/calificacionesperiodo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await CalificacionesPeriodoNegocio.deleteCalificacionesPeriodo(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/calificacionesperiodo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await CalificacionesPeriodoNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
