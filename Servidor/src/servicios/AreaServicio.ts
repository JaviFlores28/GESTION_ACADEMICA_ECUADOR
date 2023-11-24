
import { Router } from 'express';
const router = Router();
import AreaNegocio from '../negocio/AreaNegocio';
import AreaEntidad from '../entidades/AreaEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/area', async (req, res) => {
   try {
const area: AreaEntidad = req.body;
const response = await AreaNegocio.insert(area);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});

router.put('/area', async (req, res) => {
  try {
    const  area: AreaEntidad = req.body;
    const response = await AreaNegocio.update(area);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message:error.message });
   }
});

router.patch('/area', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await AreaNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await AreaNegocio.updateEstado(data);
    }
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});


router.delete('/area', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await AreaNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});

  router.get('/area', async (req, res) => {
    try {
      let area;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          area = await AreaNegocio.getAll();
          break;
        case 'enabled':
          area = await AreaNegocio.getEnabled();
          break;
        case 'id':
          area = await AreaNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(area);
    } catch (error: any) {
      res.status(500).json({ message:error.message });
    }
  });
  
export default router;
