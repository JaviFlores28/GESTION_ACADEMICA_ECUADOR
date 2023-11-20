
import { Router } from 'express';
const router = Router();
import PeriodoNegocio from '../Negocio/PeriodoNegocio';
import PeriodoEntidad from '../Entidades/PeriodoEntidad';

router.post('/periodo', async (req, res) => {
   try {
const periodo: PeriodoEntidad = req.body;
const response = await PeriodoNegocio.insert(periodo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/periodo', async (req, res) => {
  try {
    const  periodo: PeriodoEntidad = req.body;
    const response = await PeriodoNegocio.update(periodo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.patch('/periodo', async (req, res) => {
   try {
    const { masivo, data }: { masivo: boolean, data: any } = req.body;
    let response;
    if(!masivo){
      //response = await PeriodoNegocio.updateEstado(data);
    }else{
      response = await PeriodoNegocio.updateEstado(data);
    }    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/periodo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await PeriodoNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/periodo', async (req, res) => {
   try {
    let  periodo;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      periodo = await PeriodoNegocio.getAll();
    } else if (by === 'enabled') {
      
      periodo = await PeriodoNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      periodo = await PeriodoNegocio.getById(id);
    } 
    res.json(periodo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
