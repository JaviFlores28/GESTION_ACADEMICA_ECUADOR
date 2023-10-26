
import { Router } from 'express';
const router = Router();
import CursoNegocio from '../Negocio/CursoNegocio';
import CursoEntidad from '../Entidades/CursoEntidad';

router.get('/curso', async (req, res) => {
   try {
    const curso = await CursoNegocio.getCurso();
    res.json(curso);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/cursoEnabled', async (req, res) => {
   try {
    const curso = await CursoNegocio.getEnabledCurso();
    res.json(curso);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/curso', async (req, res) => {
   try {
    const request = req.body;
    const curso = new CursoEntidad(request.CRS_ID, request.CRS_NOM, request.CRS_TIPO, request.CRS_ORDEN, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await CursoNegocio.addCurso(curso);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/curso', async (req, res) => {
  try {
    const request = req.body;
    const curso = new CursoEntidad(request.CRS_ID, request.CRS_NOM, request.CRS_TIPO, request.CRS_ORDEN, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await CursoNegocio.updateCurso(curso);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/curso/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await CursoNegocio.deleteCurso(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/curso/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await CursoNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
