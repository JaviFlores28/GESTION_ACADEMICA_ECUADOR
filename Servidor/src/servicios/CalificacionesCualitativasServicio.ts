import { Router } from 'express';
const router = Router();
import CalificacionesCualitativasNegocio from '../negocio/CalificacionesCualitativasNegocio';
import CalificacionesCualitativasEntidad from '../entidades/CalificacionesCualitativasEntidad';
import { TypeRequest } from '../sistema/Interfaces/TypeRequest';

router.post('/calificacionescualitativas', async (req, res) => {
  try {
    const calificaciones_cualitativas: CalificacionesCualitativasEntidad = req.body;
    const response = await CalificacionesCualitativasNegocio.insert(calificaciones_cualitativas);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/calificacionescualitativas', async (req, res) => {
  try {
    const calificaciones_cualitativas: CalificacionesCualitativasEntidad = req.body;
    const response = await CalificacionesCualitativasNegocio.update(calificaciones_cualitativas);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/calificacionescualitativas', async (req, res) => {
  try {
    const { type, data }: TypeRequest = req.body;
    let response;
    switch (type) {
      case 'updateEstado':
        response = await CalificacionesCualitativasNegocio.updateEstado(data);
        break;
      case 'delete':
        // Handle delete case
        break;

      default:
        return res.status(400).json({ message: 'Tipo de solicitud inválida.' });
    }
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/calificacionescualitativas', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await CalificacionesCualitativasNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
});
export default router;
