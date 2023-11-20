
import { Router } from 'express';
const router = Router();
import AreaNegocio from '../Negocio/AreaNegocio';
import AreaEntidad from '../Entidades/AreaEntidad';

router.post('/area', async (req, res) => {
   try {
const area: AreaEntidad = req.body;
const response = await AreaNegocio.insert(area);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/area', async (req, res) => {
  try {
    const  area: AreaEntidad = req.body;
    const response = await AreaNegocio.update(area);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.patch('/area', async (req, res) => {
   try {
    const { masivo, data }: { masivo: boolean, data: any } = req.body;
    let response;
    if(!masivo){
      //response = await AreaNegocio.updateEstado(data);
    }else{
      response = await AreaNegocio.updateEstado(data);
    }    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/area', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await AreaNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/area', async (req, res) => {
   try {
    let  area;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      area = await AreaNegocio.getAll();
    } else if (by === 'enabled') {
      
      area = await AreaNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      area = await AreaNegocio.getById(id);
    } 
    res.json(area);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
