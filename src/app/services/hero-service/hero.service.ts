import { Injectable, signal } from '@angular/core';
import { Hero } from '../../models/hero.model';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';
import { heroes } from '../../utils/testing/consts/ExampleHeroes';
import { GetHeroesResponse } from '../../models/get-hero-response.model';
import { GetFilteredHeroesByTextResponse } from '../../models/get-filtered-heroes-by-text-response.model';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroes = signal<Hero[]>(heroes);

  get serviceHeroes() {
    return this.heroes();
  }

  getHeroes(currentPage: number, pageSize: number): Observable<GetHeroesResponse> {
    return of(this.heroes()).pipe(
      delay(1000),
      switchMap((allHeroes) => {
        const pageStartIdx = currentPage * pageSize;
        const pageEndIdx = pageStartIdx + pageSize;
        const allHeroesSlice = allHeroes.slice(pageStartIdx, pageEndIdx);
        return of({heroes: allHeroesSlice, totalHeroes: this.heroes().length});
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
      delay(1000),
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

  getFilteredHeroesByText(
    text: string,
    pageSize: number,
    currentPage: number
  ): Observable<GetFilteredHeroesByTextResponse> {
    return of(text).pipe(
      delay(1000),
      switchMap(() => {
        const pageStartIdx = currentPage * pageSize;
        const pageEndIdx = pageStartIdx + pageSize;

        const filteredHeroes = this.heroes().filter(hero => hero.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()));

        return of(
          {
            heroes: filteredHeroes.slice(pageStartIdx, pageEndIdx),
            totalHeroes: filteredHeroes.length,
            pageSize: filteredHeroes.length,
            currentPage
          }
        );
      })
    );
  }
}
