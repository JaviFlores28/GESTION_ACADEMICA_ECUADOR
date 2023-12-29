import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AutentificacionService } from '../servicios/autentificacion.service';
import { lastValueFrom } from 'rxjs';

export const authGuardDash: CanActivateFn = async (route, state) => {
  const auth = inject(AutentificacionService);
  const router = inject(Router);
  try {
    const response = await lastValueFrom(auth.isLoggedIn());
    console.log(response);
    
    if (response.response) {
      return true;
    } else {
      router.navigate(['login']);
      return false;
    }
  } catch (error) {
    router.navigate(['login']);
    return false;
  }
};

export const authGuardLogin: CanActivateFn = async (route, state) => {
  const auth = inject(AutentificacionService);
  const router = inject(Router);
  try {
    const response = await lastValueFrom(auth.isLoggedIn());
    if (response.response) {
      router.navigate(['dashboard']);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return true;
  }
  
};

export const isAdmin: CanActivateFn = async (route, state) => {
  const auth = inject(AutentificacionService);
  const router = inject(Router);
  return true
  /* if (await auth.hasRol('A')) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  } */
};
