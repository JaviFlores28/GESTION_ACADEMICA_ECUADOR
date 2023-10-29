
import { Router } from 'express';
const router = Router();
import AnioLectivoNegocio from '../Negocio/AnioLectivoNegocio';
import AnioLectivoEntidad from '../Entidades/AnioLectivoEntidad';

router.get('/aniolectivo', async (req, res) => {
   try {
    const anio_lectivo = await AnioLectivoNegocio.getAnioLectivo();
    res.json(anio_lectivo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/aniolectivoEnabled', async (req, res) => {
   try {
    const anio_lectivo = await AnioLectivoNegocio.getEnabledAnioLectivo();
    res.json(anio_lectivo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/aniolectivo', async (req, res) => {
   try {
    const request = req.body;
    const anio_lectivo = new AnioLectivoEntidad(request.AL_ID, request.AL_NOM, request.AL_INICIO, request.AL_FIN, request.AL_POR_PRD, request.AL_POR_EXAM, request.CLFN_MIN_APR, request.CLFN_MIN_PERD, request.NUM_PRD, request.NUM_EXAM, request.NUM_PRCL, request.NUM_SUSP, request.ESTADO, request.CREADOR_ID);
    const response = await AnioLectivoNegocio.addAnioLectivo(anio_lectivo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/aniolectivo', async (req, res) => {
  try {
    const request = req.body;
    const anio_lectivo = new AnioLectivoEntidad(request.AL_ID, request.AL_NOM, request.AL_INICIO, request.AL_FIN, request.AL_POR_PRD, request.AL_POR_EXAM, request.CLFN_MIN_APR, request.CLFN_MIN_PERD, request.NUM_PRD, request.NUM_EXAM, request.NUM_PRCL, request.NUM_SUSP, request.ESTADO, request.CREADOR_ID);
    const response = await AnioLectivoNegocio.updateAnioLectivo(anio_lectivo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/aniolectivo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await AnioLectivoNegocio.deleteAnioLectivo(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/aniolectivo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await AnioLectivoNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
