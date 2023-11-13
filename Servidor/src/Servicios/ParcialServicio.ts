
import { Router } from 'express';
const router = Router();
import ParcialNegocio from '../Negocio/ParcialNegocio';
import ParcialEntidad from '../Entidades/ParcialEntidad';

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
    const  parcial: ParcialEntidad = req.body;
    const response = await ParcialNegocio.update(parcial);
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
    let  parcial;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      parcial = await ParcialNegocio.getAll();
    } else if (by === 'enabled') {
      
      parcial = await ParcialNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      parcial = await ParcialNegocio.getById(id);
    } 
    res.json(parcial);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
