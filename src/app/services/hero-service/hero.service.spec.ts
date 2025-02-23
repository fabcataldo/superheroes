import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HeroService } from './hero.service';
import { heroes } from '../../utils/testing/consts/ExampleHeroes';
import { Hero } from '../../models/hero.model';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroService]
    });
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getHeroes() work, obtaining the initial heroes', fakeAsync(() => {
    let result: Hero[] = [];
    service.getHeroes().subscribe(data => result = data);
    tick(1000);
    expect(result).toEqual(heroes);
  }));

  it('should getHero() work, obtaining the hero with id = 1', fakeAsync(() => {
    let result: Hero = {id: -1, name: '', description: ''};
    service.getHero(1).subscribe(data => result = data);
    tick(1000);
    expect(result).toEqual(heroes[0]);
  }));

  it('should updateHero() work, updating the hero with id = 1', fakeAsync(() => {
    let heroUpdated: Hero = {id: 1, name: 'new Name', description: 'new description'};
    let result: Hero = {id: -1, name: '', description: ''};
    service.updateHero(heroUpdated).subscribe(data => result = data);
    tick(1000);
    expect(result).toEqual(heroUpdated);
  }));

  it('should addHero() work, adding new hero to heroes', fakeAsync(() => {
    let newHero: Hero = {id: 7675, name: 'new HERO', description: 'new description'};
    let result: Hero = {id: -1, name: '', description: ''};
    service.addHero(newHero).subscribe(data => result = data);
    tick(1000);
    expect(result).toEqual(newHero);
    expect(service.serviceHeroes.length - heroes.length).toEqual(1);
  }));

  it('should deleteHero() work, removing hero with id=1', fakeAsync(() => {
    let result: Hero = {id: -1, name: '', description: ''};
    service.deleteHero(1).subscribe(data => result = data);
    tick(1000);
    expect(result).toEqual(heroes[0]);
  }));

  it('should getFilteredHeroesByText() work, getting heroes filtering by text=sup ', fakeAsync(() => {
    let result: Hero[] = [];
    service.getFilteredHeroesByText('sup').subscribe(data => result = data);
    tick(1000);
    expect(result).toEqual([heroes[1]]);
  }));
});
