import { Injectable, signal } from '@angular/core';
import { Hero } from '../models/hero.model';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroes = signal<Hero[]>([
    { 
      id: 1,
      name: 'Spiderman',
      power: 'Spider-sense', 
      years: 35,
      weight: 80,
      description: 'Lorem ipsum dolor sit amet...' 
    },
    { 
      id: 2,
      name: 'Superman',
      power: 'Super strength',
      years: 40,
      weight: 75,
      description: 'Lorem ipsum dolor sit amet...' 
    }
  ]);

  getHeroes(): Observable<Hero[]> {
    return of(this.heroes()).pipe(
      delay(1000),
      switchMap(() => {
        return of(this.heroes());
      })
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return of(hero).pipe(
      delay(1000),
      switchMap(hero => {
        const newHero = { ...hero, id: this.heroes().length + 1 };
        this.heroes.update(current => [...current, newHero]);
        return of(hero);
      })
    );

  }

  updateHero(hero: Hero): Observable<Hero> {
    return of(hero).pipe(
      delay(1000),
      switchMap(updatedHero => {
        const heroOnHeroes = this.heroes().some(h => h.id === hero.id);
        if (!heroOnHeroes) {
          const customError = new Error(`Hero with ID ${hero.id} does not exist.`);
          return throwError(() => customError);
        }

        this.heroes.update(current => current.map(h => h.id === hero.id ? hero : h));

        return of(updatedHero);
      })
    );
  }
  

  deleteHero(id: number): Observable<Hero> {
    return of(id).pipe(
      delay(1000), // Simula el retraso del backend
      // Verificar si el héroe existe antes de actualizar
      switchMap(() => {
        const heroOnHeroes = this.heroes().find(h => h.id === id);
        if (!heroOnHeroes) {
          const customError = new Error(`Hero with ID ${id} does not exist.`);
          return throwError(() => customError);
        }
        this.heroes.update(current => current.filter(h => h.id !== id));

        return of(heroOnHeroes);
      })
    );
  }

  getHero(id: number): Observable<Hero> {
    return of(id).pipe(
      delay(1000),
      switchMap(() => {
        const heroOnHeroes = this.heroes().find(h => h.id === id);
        if (!heroOnHeroes) {
          const customError = new Error(`Hero with ID ${id} does not exist.`);
          return throwError(() => customError);
        }

        return of(heroOnHeroes);
      })
    );
  }
}
