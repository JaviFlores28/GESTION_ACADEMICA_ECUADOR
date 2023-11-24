//import AnioLectivoNegocio from './Negocio/AnioLectivoNegocio'; // Asegúrate de proporcionar la ruta correcta al archivo
import UsuarioNegocio from './Negocio/UsuarioNegocio'; // Asegúrate de proporcionar la ruta correcta al archivo
import UsuarioDatos from './datos/UsuarioDatos';

async function main() {
  try {
    const anioLectivoNegocio = new UsuarioNegocio();
    //const anioLectivo = new AnioLectivo('12', 'cambio81', new Date(), new Date(), 1, 1, 1, 1, 1, 1, 1, 1, '1', '1'); // Asegúrate de proporcionar los datos del AnioLectivo
    const usuario = null;
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
