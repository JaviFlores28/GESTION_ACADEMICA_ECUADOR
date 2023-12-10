import { Router } from 'express';
const router = Router();
import AsignaturaNegocio from '../negocio/AsignaturaNegocio';
import AsignaturaEntidad from '../entidades/AsignaturaEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/asignatura', async (req, res) => {
  try {
    const asignatura: AsignaturaEntidad = req.body;
    const response = await AsignaturaNegocio.insert(asignatura);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/asignatura', async (req, res) => {
  try {
    const asignatura: AsignaturaEntidad = req.body;
    const response = await AsignaturaNegocio.update(asignatura);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/asignatura', async (req, res) => {
  try {
    const { type, data }: TypeRequest = req.body;
    let response;
    switch (type) {
      case 'updateEstado':
        response = await AsignaturaNegocio.updateEstado(data);
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

router.delete('/asignatura', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await AsignaturaNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/asignatura', async (req, res) => {
  try {
    let asignatura;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    const id = req.query.id as string;

    switch (by) {
      case 'all':
        asignatura = await AsignaturaNegocio.getAll();
        break;
      case 'enabled':
        asignatura = await AsignaturaNegocio.getEnabled();
        break;
      case 'id':
        asignatura = await AsignaturaNegocio.getById(id);
        break;

      default:
        return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
    }
    res.json(asignatura);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
