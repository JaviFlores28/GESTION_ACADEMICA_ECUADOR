
import { Router } from 'express';
const router = Router();
import ParaleloEstudianteNegocio from '../Negocio/ParaleloEstudianteNegocio';
import ParaleloEstudianteEntidad from '../Entidades/ParaleloEstudianteEntidad';

router.get('/paraleloestudiante', async (req, res) => {
   try {
    const paralelo_estudiante = await ParaleloEstudianteNegocio.getParaleloEstudiante();
    res.json(paralelo_estudiante);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/paraleloestudianteEnabled', async (req, res) => {
   try {
    const paralelo_estudiante = await ParaleloEstudianteNegocio.getEnabledParaleloEstudiante();
    res.json(paralelo_estudiante);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/paraleloestudiante', async (req, res) => {
   try {
    const request = req.body;
    const paralelo_estudiante = new ParaleloEstudianteEntidad(request.PRLL_EST_ID, request.PRLL_ID, request.MTR_ID, request.ESTADO, request.CREADOR_ID);
    const response = await ParaleloEstudianteNegocio.addParaleloEstudiante(paralelo_estudiante);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/paraleloestudiante', async (req, res) => {
  try {
    const request = req.body;
    const paralelo_estudiante = new ParaleloEstudianteEntidad(request.PRLL_EST_ID, request.PRLL_ID, request.MTR_ID, request.ESTADO, request.CREADOR_ID);
    const response = await ParaleloEstudianteNegocio.updateParaleloEstudiante(paralelo_estudiante);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/paraleloestudiante/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ParaleloEstudianteNegocio.deleteParaleloEstudiante(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/paraleloestudiante/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ParaleloEstudianteNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
