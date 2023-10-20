
import { Router } from 'express';
const router = Router();
import AreaNegocio from '../Negocio/AreaNegocio';
import AreaEntidad from '../Entidades/AreaEntidad';

router.get('/area', async (req, res) => {
   try {
    const area = await AreaNegocio.getArea();
    res.json(area);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/area', async (req, res) => {
   try {
    const request = req.body;
    const area = new AreaEntidad(request.AREA_ID, request.AREA_NOM, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await AreaNegocio.addArea(area);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/area', async (req, res) => {
  try {
    const request = req.body;
    const area = new AreaEntidad(request.AREA_ID, request.AREA_NOM, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await AreaNegocio.updateArea(area);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/area/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await AreaNegocio.deleteArea(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/area/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await AreaNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
