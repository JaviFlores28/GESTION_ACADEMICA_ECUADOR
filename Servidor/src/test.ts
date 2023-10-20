//import AnioLectivoNegocio from './Negocio/AnioLectivoNegocio'; // Asegúrate de proporcionar la ruta correcta al archivo
import UsuarioNegocio from './Negocio/UsuarioNegocio'; // Asegúrate de proporcionar la ruta correcta al archivo

import UsuarioEntidad from './Entidades/UsuarioEntidad';

async function main() {
  try {
    const anioLectivoNegocio = new UsuarioNegocio();
    //const anioLectivo = new AnioLectivo('12', 'cambio81', new Date(), new Date(), 1, 1, 1, 1, 1, 1, 1, 1, '1', '1'); // Asegúrate de proporcionar los datos del AnioLectivo
    const usuario = new UsuarioEntidad('66c85577-59a5-42d7-9a53-a7c4c73f15e3', 'cambio', '', '', '', '', '', '', '', '', new Date(), '', '', '', 1, 1, 1, '1');
    const serializedObject = JSON.stringify(usuario);
    // const result2 = await anioLectivoNegocio.obtenerAnioLectivos()
    console.log(serializedObject);
    /* if (result2.error) {
      const result3 = await anioLectivoNegocio.obtenerAnioLectivos();
      console.log(result3);
    } */
  } catch (error) {
    console.error(error);
  }
}

main();
