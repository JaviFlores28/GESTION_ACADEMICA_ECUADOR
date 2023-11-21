import { Router } from 'express';
const router = Router();
import CalificacionesCualitativasNegocio from '../negocio/CalificacionesCualitativasNegocio';
import CalificacionesCualitativasEntidad from '../entidades/CalificacionesCualitativasEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/calificacionescualitativas', async (req, res) => {
  try {
    const calificaciones_cualitativas: CalificacionesCualitativasEntidad = req.body;
    const response = await CalificacionesCualitativasNegocio.insert(calificaciones_cualitativas);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/calificacionescualitativas', async (req, res) => {
  try {
    const calificaciones_cualitativas: CalificacionesCualitativasEntidad = req.body;
    const response = await CalificacionesCualitativasNegocio.update(calificaciones_cualitativas);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.patch('/calificacionescualitativas', async (req, res) => {
  try {
    const { masivo, type, data }: TypeRequest = req.body;
    let response;
    if (masivo && type === 'updateEstado') {
      response = await CalificacionesCualitativasNegocio.updateEstado(data);
    } else if (masivo && type === 'delete') {
      //response = await CalificacionesCualitativasNegocio.updateEstado(data);
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.delete('/calificacionescualitativas', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await CalificacionesCualitativasNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.get('/calificacionescualitativas', async (req, res) => {
  try {
    let calificaciones_cualitativas;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    const id = req.query.id as string;

    switch (by) {
      case 'all':
        calificaciones_cualitativas = await CalificacionesCualitativasNegocio.getAll();
        break;
      case 'enabled':
        calificaciones_cualitativas = await CalificacionesCualitativasNegocio.getEnabled();
        break;
      case 'id':
        calificaciones_cualitativas = await CalificacionesCualitativasNegocio.getById(id);
        break;

      default:
        return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
    }
    res.json(calificaciones_cualitativas);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

export default router;
