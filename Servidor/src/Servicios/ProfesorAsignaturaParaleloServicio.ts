
import { Router } from 'express';
const router = Router();
import ProfesorAsignaturaParaleloNegocio from '../Negocio/ProfesorAsignaturaParaleloNegocio';
import ProfesorAsignaturaParaleloEntidad from '../Entidades/ProfesorAsignaturaParaleloEntidad';

router.get('/profesorasignaturaparalelo', async (req, res) => {
   try {
    const profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getProfesorAsignaturaParalelo();
    res.json(profesor_asignatura_paralelo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/profesorasignaturaparaleloEnabled', async (req, res) => {
   try {
    const profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getEnabledProfesorAsignaturaParalelo();
    res.json(profesor_asignatura_paralelo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/profesorasignaturaparalelo', async (req, res) => {
   try {
    const request = req.body;
    const profesor_asignatura_paralelo = new ProfesorAsignaturaParaleloEntidad(request.PRF_ASG_PRLL_ID, request.ASG_ID, request.PRF_ID, request.PRLL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await ProfesorAsignaturaParaleloNegocio.addProfesorAsignaturaParalelo(profesor_asignatura_paralelo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profesorasignaturaparalelo', async (req, res) => {
  try {
    const request = req.body;
    const profesor_asignatura_paralelo = new ProfesorAsignaturaParaleloEntidad(request.PRF_ASG_PRLL_ID, request.ASG_ID, request.PRF_ID, request.PRLL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await ProfesorAsignaturaParaleloNegocio.updateProfesorAsignaturaParalelo(profesor_asignatura_paralelo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/profesorasignaturaparalelo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ProfesorAsignaturaParaleloNegocio.deleteProfesorAsignaturaParalelo(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profesorasignaturaparalelo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ProfesorAsignaturaParaleloNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
