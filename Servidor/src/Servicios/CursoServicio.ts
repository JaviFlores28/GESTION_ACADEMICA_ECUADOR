import { Router } from 'express';
const router = Router();
import CursoNegocio from '../negocio/CursoNegocio';
import CursoEntidad from '../entidades/CursoEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/curso', async (req, res) => {
  try {
    const curso: CursoEntidad = req.body;
    const response = await CursoNegocio.insert(curso);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/curso', async (req, res) => {
  try {
    const curso: CursoEntidad = req.body;
    const response = await CursoNegocio.update(curso);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.patch('/curso', async (req, res) => {
  try {
    const { masivo, type, data }: TypeRequest = req.body;
    let response;
    if (masivo && type === 'updateEstado') {
      response = await CursoNegocio.updateEstado(data);
    } else if (masivo && type === 'delete') {
      //response = await CursoNegocio.updateEstado(data);
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.delete('/curso', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await CursoNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.get('/curso', async (req, res) => {
  try {
    let curso;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    const id = req.query.id as string;

    switch (by) {
      case 'all':
        curso = await CursoNegocio.getAll();
        break;
      case 'enabled':
        curso = await CursoNegocio.getEnabled();
        break;
      case 'id':
        curso = await CursoNegocio.getById(id);
        break;

      default:
        return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
    }
    res.json(curso);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

export default router;
