import { Routes } from '@angular/router';
import { HeroListComponent } from './pages/hero-list/hero-list.component';
import { HeroFormComponent } from './pages/hero-form/hero-form.component';
import { HeroDetailComponent } from './pages/hero-detail/hero-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: '', component: HeroListComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { 
        path: 'create-edit',
        children: [
            { path: '', component: HeroFormComponent, canActivate: [authGuard] },
            { path: ':id', component: HeroFormComponent, canActivate: [authGuard] }
        ]
    },
    { path: 'detail/:id', component: HeroDetailComponent, canActivate: [authGuard] },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: '/not-found' },
];
