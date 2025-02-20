import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../models/hero.model';

@Component({
  selector: 'app-hero-detail',
  imports: [],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss'
})
export class HeroDetailComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _heroService = inject(HeroService);

  hero = signal<Hero | undefined>(undefined);

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      const currentHero = this._heroService.getHeroes()().find(hero => hero.id === Number(params['id']));
      console.log(params)
      if(currentHero) {
        this.hero.set(currentHero);
      }
    });
  }
}
