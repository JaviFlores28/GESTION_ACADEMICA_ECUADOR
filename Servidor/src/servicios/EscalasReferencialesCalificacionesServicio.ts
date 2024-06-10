import { Router } from 'express';
const router = Router();
import EscalasReferencialesCalificacionesNegocio from '../negocio/EscalasReferencialesCalificacionesNegocio';
import EscalasReferencialesCalificacionesEntidad from '../entidades/EscalasReferencialesCalificacionesEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/escalasreferencialescalificaciones', async (req, res) => {
  try {
    const escalas_referenciales_calificaciones: EscalasReferencialesCalificacionesEntidad = req.body;
    const response = await EscalasReferencialesCalificacionesNegocio.insert(escalas_referenciales_calificaciones);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/escalasreferencialescalificaciones', async (req, res) => {
  try {
    const escalas_referenciales_calificaciones: EscalasReferencialesCalificacionesEntidad = req.body;
    const response = await EscalasReferencialesCalificacionesNegocio.update(escalas_referenciales_calificaciones);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/escalasreferencialescalificaciones', async (req, res) => {
  try {
    const { type, data }: TypeRequest = req.body;
    let response;
    switch (type) {
      case 'updateEstado':
        response = await EscalasReferencialesCalificacionesNegocio.updateEstado(data);
        break;

      default:
        return res.status(400).json({ message: 'Tipo de solicitud inválida.' });
    }
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/escalasreferencialescalificaciones', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await EscalasReferencialesCalificacionesNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/escalasreferencialescalificaciones', async (req, res) => {
  try {
    let escalas_referenciales_calificaciones;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    const id = req.query.id as string;

    switch (by) {
      case 'all':
        escalas_referenciales_calificaciones = await EscalasReferencialesCalificacionesNegocio.getAll();
        break;
      case 'enabled':
        escalas_referenciales_calificaciones = await EscalasReferencialesCalificacionesNegocio.getEnabled();
        break;
      case 'id':
        escalas_referenciales_calificaciones = await EscalasReferencialesCalificacionesNegocio.getById(id);
        break;

      default:
        return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
    }
    res.json(escalas_referenciales_calificaciones);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
