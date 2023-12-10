import { Router } from 'express';
const router = Router();
import ParcialNegocio from '../negocio/ParcialNegocio';
import ParcialEntidad from '../entidades/ParcialEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/parcial', async (req, res) => {
  try {
    const parcial: ParcialEntidad = req.body;
    const response = await ParcialNegocio.insert(parcial);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/parcial', async (req, res) => {
  try {
    const parcial: ParcialEntidad = req.body;
    const response = await ParcialNegocio.update(parcial);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/parcial', async (req, res) => {
  try {
    const { type, data }: TypeRequest = req.body;
    let response;
    switch (type) {
      case 'updateEstado':
        response = await ParcialNegocio.updateEstado(data);
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

router.delete('/parcial', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ParcialNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/parcial', async (req, res) => {
  try {
    let parcial;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    const id = req.query.id as string;

    switch (by) {
      case 'all':
        parcial = await ParcialNegocio.getAll();
        break;
      case 'enabled':
        parcial = await ParcialNegocio.getEnabled();
        break;
      case 'id':
        parcial = await ParcialNegocio.getById(id);
        break;
      case 'getByPeriodo':
        parcial = await ParcialNegocio.getByPeriodo(id);
        break;
      default:
        return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
    }
    res.json(parcial);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
