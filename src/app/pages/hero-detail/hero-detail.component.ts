import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../models/hero.model';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [LoadingComponent, CommonModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss'
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private _route = inject(ActivatedRoute);
  private _heroService = inject(HeroService);
  private _location = inject(Location);
  private _router = inject(Router);


  hero = signal<Hero | undefined>(undefined);
  private subscriptions$ = new Subject<void>();

  loading = signal(true);

  ngOnInit(): void {
    this._route.params.pipe(takeUntil(this.subscriptions$)).subscribe(params => {
      this._heroService.getHero(Number(params['id']))
        .pipe(takeUntil(this.subscriptions$)).subscribe({
          next: (res) => {
            console.log('🎯 Héroe recibido:', res);
            this.hero.set(res);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('⛔ Error al obtener el héroe:', err);
            this.loading.set(false);
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  goBack(): void {
    if (window.history.length > 1) {
      this._location.back(); // 🔥 Vuelve a la página anterior si hay historial
    } else {
      this._router.navigate(['/']); // 🔥 Si no hay historial, vuelve a la lista de héroes
    }
  }
}
