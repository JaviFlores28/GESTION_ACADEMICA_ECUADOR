
import { Router } from 'express';
const router = Router();
import ParaleloNegocio from '../Negocio/ParaleloNegocio';
import ParaleloEntidad from '../Entidades/ParaleloEntidad';

router.post('/paralelo', async (req, res) => {
   try {
const paralelo: ParaleloEntidad = req.body;
const response = await ParaleloNegocio.insert(paralelo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/paralelo', async (req, res) => {
  try {
    const  paralelo: ParaleloEntidad = req.body;
    const response = await ParaleloNegocio.update(paralelo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/paralelo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ParaleloNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/paralelo', async (req, res) => {
   try {
    let  paralelo;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      paralelo = await ParaleloNegocio.getAll();
    } else if (by === 'enabled') {
      
      paralelo = await ParaleloNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      paralelo = await ParaleloNegocio.getById(id);
    } 
    res.json(paralelo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
