import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { HeroService } from '../../services/hero.service';
import {MatButtonModule} from '@angular/material/button';
import { Hero } from '../../models/hero.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss'
})
export class HeroListComponent implements OnInit {
  private _router = inject(Router);

  heroService: HeroService = inject(HeroService);
  loading = signal(false);
  localHeroes = signal<Hero[]>([]);
  displayedColumns: string[] = ['name', 'power', 'actions'];

  constructor() {
  }

  ngOnInit(): void {

  }

  goToEditPage(element: Hero){
    this._router.navigate([`/create-edit`, element.id]);
  }

  goToDetailPage(element: Hero) {
    console.log('elem,ent')
    console.log(element)
    this._router.navigate([`/detail`, element.id]);
  }
}
