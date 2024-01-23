import { Router } from 'express';
const router = Router();
import ProfesorAsignaturaParaleloNegocio from '../negocio/ProfesorAsignaturaParaleloNegocio';
import ProfesorAsignaturaParaleloEntidad from '../entidades/ProfesorAsignaturaParaleloEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/profesorasignaturaparalelo', async (req, res) => {
  try {
    const { masivo, data }: TypeRequest = req.body;
    let response;
    if (!masivo) {
      response = await ProfesorAsignaturaParaleloNegocio.insert(data);
    } else {
      response = await ProfesorAsignaturaParaleloNegocio.insertMasivo(data);
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profesorasignaturaparalelo', async (req, res) => {
  try {
    const profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad = req.body;
    const response = await ProfesorAsignaturaParaleloNegocio.update(profesor_asignatura_paralelo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/profesorasignaturaparalelo', async (req, res) => {
  try {
    const { type, data }: TypeRequest = req.body;
    let response;
    switch (type) {
      case 'updateEstado':
        response = await ProfesorAsignaturaParaleloNegocio.updateEstado(data);
        break;
      case 'getByPrf':
        response = await ProfesorAsignaturaParaleloNegocio.getByPrf(data);
        break;
      default:
        return res.status(400).json({ message: 'Tipo de solicitud inválida.' });
    }
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/profesorasignaturaparalelo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ProfesorAsignaturaParaleloNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profesorasignaturaparalelo', async (req, res) => {
  try {
    let profesor_asignatura_paralelo;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    const id = req.query.id as string;

    switch (by) {
      case 'all':
        profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getAll();
        break;
      case 'enabled':
        profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getEnabled();
        break;
      case 'id':
        profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getById(id);
        break;

      default:
        return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
    }
    res.json(profesor_asignatura_paralelo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
