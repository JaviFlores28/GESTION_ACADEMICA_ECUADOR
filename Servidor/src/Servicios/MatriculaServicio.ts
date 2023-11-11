
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


router.get('/matriculaByCurso/', async (req, res) => {
  try {
    const curso = req.query.curso as string;
    if (!curso) {
      return res.status(400).json({ message: 'Falta el parámetro "curso" en la consulta.' });
    }
    const estudiante = await MatriculaNegocio.getEnabledMatriculaByCurso(curso);
    res.json(estudiante);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/matricula', async (req, res) => {
  try {
    const request = req.body;
    const matricula = new MatriculaEntidad(request.MTR_ID, request.CRS_ID, request.EST_ID, request.ESTADO, request.PASE, request.CREADOR_ID);
    const response = await MatriculaNegocio.addMatricula(matricula);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/matricula', async (req, res) => {
  try {
    const request = req.body;
    const estado = request.estado;
    const ids = request.ids;
    // const matricula = new MatriculaEntidad(request.MTR_ID, request.CRS_ID, request.EST_ID, request.ESTADO, request.PASE, request.CREADOR_ID);
    const response = await MatriculaNegocio.updateEstadoMatricula(ids, estado);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/matricula', async (req, res) => {
  try {
    const idsParam = req.query.ids as string;
    if (!idsParam) {
      return res.status(400).json({ message: 'Falta el parámetro "ids" en la consulta.' });
    }
    const ids = idsParam.split(',');
    const response = await MatriculaNegocio.deleteMatricula(ids);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/matricula', async (req, res) => {
  try {
    const id =  req.query.ids as string;
    if (!id) {
      return res.status(400).json({ message: 'Falta el parámetro "ids" en la consulta.' });
    }
    const response = await MatriculaNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
