import { Router } from 'express';
const router = Router();
import AnioLectivoNegocio from '../negocio/AnioLectivoNegocio';
import AnioLectivoEntidad from '../entidades/AnioLectivoEntidad';
import { TypeRequest } from '../sistema/Interfaces/TypeRequest';

router.post('/aniolectivo', async (req, res) => {
  try {
    const anio_lectivo: AnioLectivoEntidad = req.body;
    const response = await AnioLectivoNegocio.insert(anio_lectivo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/aniolectivo', async (req, res) => {
  try {
    const anio_lectivo: AnioLectivoEntidad = req.body;
    const response = await AnioLectivoNegocio.update(anio_lectivo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/aniolectivo', async (req, res) => {
  try {
    const { type, data }: TypeRequest = req.body;
    let response;
    switch (type) {
      case 'updateEstado':
        response = await AnioLectivoNegocio.updateEstado(data);
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

router.delete('/aniolectivo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await AnioLectivoNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/aniolectivo', async (req, res) => {
  try {
    let anio_lectivo;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    const id = req.query.id as string;

    switch (by) {
      case 'all':
        anio_lectivo = await AnioLectivoNegocio.getAll();
        break;
      case 'enabled':
        anio_lectivo = await AnioLectivoNegocio.getEnabled();
        break;
      case 'id':
        anio_lectivo = await AnioLectivoNegocio.getById(id);
        break;

      default:
        return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
    }
    res.json(anio_lectivo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
