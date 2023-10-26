
import { Router } from 'express';
const router = Router();
import MatriculaNegocio from '../Negocio/MatriculaNegocio';
import MatriculaEntidad from '../Entidades/MatriculaEntidad';

router.get('/matricula', async (req, res) => {
   try {
    const matricula = await MatriculaNegocio.getMatricula();
    res.json(matricula);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/matriculaEnabled', async (req, res) => {
   try {
    const matricula = await MatriculaNegocio.getEnabledMatricula();
    res.json(matricula);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/matricula', async (req, res) => {
   try {
    const request = req.body;
    const matricula = new MatriculaEntidad(request.MTR_ID, request.CRS_ID, request.EST_ID, request.ESTADO, request.PASE, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await MatriculaNegocio.addMatricula(matricula);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/matricula', async (req, res) => {
  try {
    const request = req.body;
    const matricula = new MatriculaEntidad(request.MTR_ID, request.CRS_ID, request.EST_ID, request.ESTADO, request.PASE, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await MatriculaNegocio.updateMatricula(matricula);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/matricula/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await MatriculaNegocio.deleteMatricula(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/matricula/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await MatriculaNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
