import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/hero-service/hero.service';
import { Hero } from '../../models/hero.model';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [LoadingComponent, CommonModule, MatCardModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss'
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  public route = inject(ActivatedRoute);
  public heroService = inject(HeroService);
  public location = inject(Location);
  public router = inject(Router);


  hero = signal<Hero | undefined>(undefined);
  private subscriptions$ = new Subject<void>();

  loading = signal(true);

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.subscriptions$)).subscribe(params => {
      this.heroService.getHero(Number(params['id']))
        .pipe(takeUntil(this.subscriptions$)).subscribe({
          next: (res) => {
            this.hero.set(res);
            this.loading.set(false);
          },
          error: (err) => {
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
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
