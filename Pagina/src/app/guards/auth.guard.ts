import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';
import { inject } from '@angular/core';



export const authGuard: CanActivateFn = (route, state) => {
  const auth=inject(UsuarioService);
  const router=inject(Router);
  if (auth.isLoggedIn()) {
    return true;
  }else{
    router.navigate(['']);
    return false;
  }
};

export const authGuardLogin: CanActivateFn = (route, state) => {
  const auth=inject(UsuarioService);
  const router=inject(Router);
  if (auth.isLoggedIn()) {
    router.navigate(['dashboard']);
    return false;
  }else{
    return true;
  }
};


export const isAdmin: CanActivateFn = async (route, state) => {
  const auth=inject(UsuarioService);
  const router=inject(Router);
  if (await auth.hasRol('A')) {
    return true;
  }else{
    router.navigate(['']);
    return false;
  }
};