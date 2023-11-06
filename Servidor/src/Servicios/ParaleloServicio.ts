
import { Router } from 'express';
const router = Router();
import ParaleloNegocio from '../Negocio/ParaleloNegocio';
import ParaleloEntidad from '../Entidades/ParaleloEntidad';

router.get('/paralelo', async (req, res) => {
   try {
    const paralelo = await ParaleloNegocio.getParalelo();
    res.json(paralelo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/paraleloEnabled/:curso', async (req, res) => {
   try {
    const cursoId = req.params.curso;
    const paralelo = await ParaleloNegocio.getEnabledParalelo(cursoId);
    res.json(paralelo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/paralelo', async (req, res) => {
   try {
    const request = req.body;
    const paralelo = new ParaleloEntidad(request.PRLL_ID, request.PRLL_NOM, request.CRS_ID, request.AL_ID, request.ESTADO, request.CREADOR_ID);
    const response = await ParaleloNegocio.addParalelo(paralelo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/paralelo', async (req, res) => {
  try {
    const request = req.body;
    const paralelo = new ParaleloEntidad(request.PRLL_ID, request.PRLL_NOM, request.CRS_ID, request.AL_ID, request.ESTADO, request.CREADOR_ID);
    const response = await ParaleloNegocio.updateParalelo(paralelo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/paralelo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ParaleloNegocio.deleteParalelo(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/paralelo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ParaleloNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
