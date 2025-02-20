import { Routes } from '@angular/router';
import { HeroListComponent } from './pages/hero-list/hero-list.component';
import { HeroFormComponent } from './pages/hero-form/hero-form.component';
import { HeroDetailComponent } from './pages/hero-detail/hero-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: HeroListComponent },
    { path: 'create-edit/:id', component: HeroFormComponent },
    { path: 'detail/:id', component: HeroDetailComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
