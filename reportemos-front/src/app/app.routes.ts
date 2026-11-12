import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Sidebar } from './components/sidebar/sidebar';
import { Escritorio } from './components/escritorio/escritorio';
import { Reportes } from './components/reportes/reportes';
import { AdminUsuarios } from './components/admin-usuarios/admin-usuarios';
import { AdminReportes } from './components/admin-reportes/admin-reportes';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  // Públicas
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  // Privadas: el guard revisa el token y el sidebar envuelve las páginas hijas
  {
    path: '',
    component: Sidebar,
    canActivate: [authGuard],
    children: [
      { path: 'escritorio', component: Escritorio },
      { path: 'reportes', component: Reportes },

      // Solo admin
      { path: 'admin/reportes', component: AdminReportes, canActivate: [adminGuard] },
      { path: 'admin/usuarios', component: AdminUsuarios, canActivate: [adminGuard] },

      { path: '', redirectTo: 'escritorio', pathMatch: 'full' },
    ],
  },

  // Cualquier otra ruta
  { path: '**', redirectTo: '' },
];