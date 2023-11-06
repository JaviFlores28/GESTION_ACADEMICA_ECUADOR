
import { Router } from 'express';
const router = Router();
import ParcialNegocio from '../Negocio/ParcialNegocio';
import ParcialEntidad from '../Entidades/ParcialEntidad';

router.get('/parcial', async (req, res) => {
   try {
    const parcial = await ParcialNegocio.getParcial();
    res.json(parcial);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/parcialEnabled', async (req, res) => {
   try {
    const parcial = await ParcialNegocio.getEnabledParcial();
    res.json(parcial);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/parcial', async (req, res) => {
   try {
    const request = req.body;
    const parcial = new ParcialEntidad(request.PRCL_ID, request.PRCL_NOM, request.PRCL_INI, request.PRCL_FIN, request.ESTADO, request.PRCL_TIPO, request.PRD_ID, request.CREADOR_ID);
    const response = await ParcialNegocio.addParcial(parcial);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/parcial', async (req, res) => {
  try {
    const request = req.body;
    const parcial = new ParcialEntidad(request.PRCL_ID, request.PRCL_NOM, request.PRCL_INI, request.PRCL_FIN, request.ESTADO, request.PRCL_TIPO, request.PRD_ID, request.CREADOR_ID);
    const response = await ParcialNegocio.updateParcial(parcial);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/parcial/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ParcialNegocio.deleteParcial(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/parcial/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ParcialNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
