
import { Router } from 'express';
const router = Router();
import DetalleUsuarioProfesorNegocio from '../Negocio/DetalleUsuarioProfesorNegocio';
import DetalleUsuarioProfesorEntidad from '../Entidades/DetalleUsuarioProfesorEntidad';

router.get('/detalleusuarioprofesor', async (req, res) => {
   try {
    const detalle_usuario_profesor = await DetalleUsuarioProfesorNegocio.getDetalleUsuarioProfesor();
    res.json(detalle_usuario_profesor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/detalleusuarioprofesorEnabled', async (req, res) => {
   try {
    const detalle_usuario_profesor = await DetalleUsuarioProfesorNegocio.getEnabledDetalleUsuarioProfesor();
    res.json(detalle_usuario_profesor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/detalleusuarioprofesor', async (req, res) => {
   try {
    const request = req.body;
    const detalle_usuario_profesor = new DetalleUsuarioProfesorEntidad(request.DTLL_PRF_ID, request.PRF_FECH_INGR_INST, request.PRF_FECH_INGR_MAG, request.USR_ID);
    const response = await DetalleUsuarioProfesorNegocio.addDetalleUsuarioProfesor(detalle_usuario_profesor);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/detalleusuarioprofesor', async (req, res) => {
  try {
    const request = req.body;
    const detalle_usuario_profesor = new DetalleUsuarioProfesorEntidad(request.DTLL_PRF_ID, request.PRF_FECH_INGR_INST, request.PRF_FECH_INGR_MAG, request.USR_ID);
    const response = await DetalleUsuarioProfesorNegocio.updateDetalleUsuarioProfesor(detalle_usuario_profesor);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/detalleusuarioprofesor/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await DetalleUsuarioProfesorNegocio.deleteDetalleUsuarioProfesor(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/detalleusuarioprofesor/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await DetalleUsuarioProfesorNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
