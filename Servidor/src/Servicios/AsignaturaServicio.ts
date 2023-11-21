import { Router } from 'express';
const router = Router();
import AsignaturaNegocio from '../Negocio/AsignaturaNegocio';
import AsignaturaEntidad from '../Entidades/AsignaturaEntidad';
import { TypeRequest } from '../sistema/Interfaces/TypeRequest';

router.post('/asignatura', async (req, res) => {
  try {
    const asignatura: AsignaturaEntidad = req.body;
    const response = await AsignaturaNegocio.insert(asignatura);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/asignatura', async (req, res) => {
  try {
    const asignatura: AsignaturaEntidad = req.body;
    const response = await AsignaturaNegocio.update(asignatura);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.patch('/asignatura', async (req, res) => {
  try {
    const { masivo, type, data }: TypeRequest = req.body;
    let response;
    if (masivo && type === 'updateEstado') {
      response = await AsignaturaNegocio.updateEstado(data);
    } else if (masivo && type === 'delete') {
      //response = await AsignaturaNegocio.updateEstado(data);
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.delete('/asignatura', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await AsignaturaNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
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
    res.status(500).json({ message: error.code });
  }
});

export default router;
