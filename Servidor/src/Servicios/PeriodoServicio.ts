
import { Router } from 'express';
const router = Router();
import PeriodoNegocio from '../Negocio/PeriodoNegocio';
import PeriodoEntidad from '../Entidades/PeriodoEntidad';

router.get('/periodo', async (req, res) => {
   try {
    const periodo = await PeriodoNegocio.getPeriodo();
    res.json(periodo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/periodo', async (req, res) => {
   try {
    const request = req.body;
    const periodo = new PeriodoEntidad(request.PRD_ID, request.PRD_NOM, request.PRD_TIPO, request.AL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await PeriodoNegocio.addPeriodo(periodo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/periodo', async (req, res) => {
  try {
    const request = req.body;
    const periodo = new PeriodoEntidad(request.PRD_ID, request.PRD_NOM, request.PRD_TIPO, request.AL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await PeriodoNegocio.updatePeriodo(periodo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/periodo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await PeriodoNegocio.deletePeriodo(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/periodo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await PeriodoNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
