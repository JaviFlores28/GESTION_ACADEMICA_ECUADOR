import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

export class MyValidators extends Validators {

static validateCedula(control: AbstractControl): 
  Observable<ValidationErrors | null> {
    const cedula = control.value;
    const valueCedula = MyValidators.isValidCedula(cedula);
    if (!valueCedula) {
      return of( { cedulaInvalida: true, message: '*Cédula no válida.' });
    }
    return of(null);
  }

  static validateCelular(control: AbstractControl): 
  Observable<ValidationErrors | null> {
    const cadena = control.value as string;
    //const celularRegExp = /[0-9]/.test(cadena);
    const isNumeroCel = MyValidators.isNumeroCelular(cadena);
    //console.log('empieza en 0 y 10 numeors -->'+celularRegExp);
    console.log('es celular --> '+isNumeroCel);
    
    if (!isNumeroCel) {
      return of( { celularInvalido: true, message: '*Número celular inválido' });
    }else{
      return of(null);

    }
  }

static excluirNumero(control: AbstractControl): 
  Observable<ValidationErrors | null> {
    const cadena = control.value as string;
    const cedulaRegExp = /[0-9]/.test(cadena);
    if (cedulaRegExp) {
      return of( { existNumero: true, message: '*No puede contener números' });
    }
    return of(null);
  }

  static validarCorreo(control: AbstractControl): 
  Observable<ValidationErrors | null> {
    const cadena = control.value as string;
    const patronCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!patronCorreo.test(cadena)) {
      return of( { correoValido: true, message: '*Correo no válido' });
    }
    return of(null);
  }

  static excluirLetras(control: AbstractControl): 
  Observable<ValidationErrors | null> {
    const cadena = control.value as string;
    const cedulaRegExp = /[A-Z]/.test(cadena);
    if (cedulaRegExp) {
      return of( { existLetras: true, message: '*No puede contener letras' });
    }
    return of(null);
  }
  
  static soloLetras(control: AbstractControl): 
  Observable<ValidationErrors | null> {
      const cadena = control.value as string;
      const cedulaRegExp = /[^A-Za-z]/.test(cadena);
      if (cedulaRegExp) {
          return of( { soloLetras: true, message: '*Solo letras' });
        }
        return of(null);
    }
    static soloNumeros(control: AbstractControl): 
    Observable<ValidationErrors | null> {
        const cadena = control.value as string;
        const cedulaRegExp = /[^0-9]/.test(cadena);
        console.log(' value --> ' + cedulaRegExp);
        
        if (cedulaRegExp) {
            return of( { soloNumeros: true, message: '*Solo números' });
          }
        /*if (cadena.length != 10) {
            return of( { soloNumeros: true, message: '*Código inválido' });
        }  */
          return of(null);
      } 
    
      static calificacion(control: AbstractControl): 
  Observable<ValidationErrors | null> {
    const cadena = control.value.toString();
    //const caliRegExp = /[0-9.]/.test(cadena);
    const isCali = MyValidators.isCalificacion(cadena);
    if (!isCali) {
      return of( { calificacionInvalida: true, message: '*Calificación inválida' });
    }
    return of(null);
  } 
  static isCalificacion(cadena: string) {
    const nota = parseFloat(cadena);
    if (nota <= 0 || nota > 10) {
      return false;
    }else {
      return true;
    }
  }
      
    private static isValidCedula(cedula: string): boolean {
        var total = 0;
        const longitud = cedula.length;
        var longcheck = longitud - 1;
        if (cedula !== "" && longitud === 10) {
            for (let i = 0; i < longcheck; i++) {
                if (i % 2 === 0) {
                    const aux: number = parseInt(cedula.charAt(i), 10) * 2;
                    if (aux > 9) {
                        total += aux - 9;
                    } else {
                        total += aux;
                    }
                } else {
                    total += parseInt(cedula.charAt(i)); // parseInt o concatenará en lugar de sumar
                }
            }
            total = total % 10 ? 10 - (total % 10) : 0;

            if (cedula.charAt(longitud - 1) === total.toString()) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }
    private static isNumeroCelular(celular: string){
            if (parseInt(celular[0]) == 0 && celular.length == 10) {
              if (parseInt(celular[1]) == 9 && celular.length == 10) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }

    }
}

