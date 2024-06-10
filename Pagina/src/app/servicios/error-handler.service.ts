import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleError(error: HttpErrorResponse) {
    
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `${error.error.message}`;
    } else {
      // Errores del lado del servidor
      errorMessage = `${error.error.message}`;
    }

   // console.error(errorMessage);
    return throwError(() => new Error(errorMessage)); // Utiliza una función de fábrica para crear el error
  }
}
