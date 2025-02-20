import { Injectable, signal } from '@angular/core';
import { Hero } from '../models/hero.model';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroes = signal<Hero[]>([
    { id: 1, name: 'Spiderman', power: 'Spider-sense', years: 35, weight: 80, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in ligula id magna bibendum aliquet quis sit amet est. Nam libero velit, tempor in molestie vel, molestie eu nulla. Maecenas in feugiat justo. Praesent fermentum leo ac odio ornare, vel tempus turpis placerat. Cras ac mi nec erat pulvinar ullamcorper at eget massa. Aenean eget eleifend arcu. Ut gravida non nisl a ultrices. Praesent egestas sit amet diam tempor lobortis. Nulla ac felis euismod, pretium nulla et, vehicula tortor. Proin hendrerit lectus leo, et consequat eros pulvinar id. Aliquam non turpis ut libero lobortis commodo. Etiam sit amet tellus tellus. Donec dictum volutpat ante, in sodales mi fringilla sit amet. Nunc sed fermentum dolor, vitae convallis neque.' },
    { id: 2, name: 'Superman', power: 'Super strength', years: 40, weight: 75, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in ligula id magna bibendum aliquet quis sit amet est. Nam libero velit, tempor in molestie vel, molestie eu nulla. Maecenas in feugiat justo. Praesent fermentum leo ac odio ornare, vel tempus turpis placerat. Cras ac mi nec erat pulvinar ullamcorper at eget massa. Aenean eget eleifend arcu. Ut gravida non nisl a ultrices. Praesent egestas sit amet diam tempor lobortis. Nulla ac felis euismod, pretium nulla et, vehicula tortor. Proin hendrerit lectus leo, et consequat eros pulvinar id. Aliquam non turpis ut libero lobortis commodo. Etiam sit amet tellus tellus. Donec dictum volutpat ante, in sodales mi fringilla sit amet. Nunc sed fermentum dolor, vitae convallis neque.' }
  ]);
  constructor() { }

  getHeroes() {
    return this.heroes; 
  }

  addHero(hero: Hero): void {
    of(hero).pipe(
      //simulates delay from backend's call
      delay(1000)
    ).subscribe(newHero => {
      this.heroes.update((current) => [
        ...current,
        { ...newHero, id: current.length + 1 }
      ]);
    });
  }

  updateHero(hero: Hero): void {
    of(hero).pipe(
      delay(1000)
    ).subscribe(() => {
      this.heroes.update((current) => current.map(h => h.id === hero.id ? hero : h));
    })
 
  }

  deleteHero(id: number): void {
    of(id).pipe(
      delay(1000)
    ).subscribe(newHero => {
      this.heroes.update((current) => current.filter(h => h.id !== id));
    })
  }
}
