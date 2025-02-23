import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/hero-service/hero.service';
import { Hero } from '../../models/hero.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';
import { Location } from '@angular/common';
import { UppercaseDirective } from '../../utils/directives/uppercase.directive';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgClass, LoadingComponent, UppercaseDirective],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss'
})
export class HeroFormComponent implements OnInit, OnDestroy {
  public route = inject(ActivatedRoute);
  public heroService = inject(HeroService);
  public router = inject(Router);
  public location = inject(Location);

  hero = signal<Hero | undefined>(undefined);

  heroForm!: FormGroup;
  loading = signal(false);
  private subscriptions$ = new Subject<void>();
  loadingSubmitButton = signal(false);

  constructor(private formBuilder: FormBuilder) {
    this.heroForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      power: [''],
      weight: [''],
      years: [''],
      description: ['', [Validators.required, Validators.minLength(2)]]
    })
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idHero = Number(params['id']);
      if(idHero){
        this.loading.set(true);
        this.heroService.getHero(idHero)
        .pipe(takeUntil(this.subscriptions$)).subscribe({
          next: (res) => {
            const hero = res;
          if (hero) {
            this.hero.set(res);

            this.heroForm.setValue({
              name: hero.name,
              power: hero.power,
              weight: hero.weight,
              years: hero.years,
              description: hero.description
            });
            this.loading.set(false);
          }
          },
          error: (err) => {
            this.loading.set(false);
          }
        });
      }
    });
  }

  onSubmit(event: Event){
    event.preventDefault();
    this.loadingSubmitButton.set(true);

    if (this.heroForm.valid){
      if(this.hero()){
        this.heroService.updateHero({...this.heroForm.value, id: this.hero()?.id}).pipe(takeUntil(this.subscriptions$)).subscribe(res => {
          this.loadingSubmitButton.set(false);
          this.navigateToRoot();
        });
      } else {
        this.heroService.addHero(this.heroForm.value).pipe(takeUntil(this.subscriptions$)).subscribe(res => {
          this.loadingSubmitButton.set(false);
          this.navigateToRoot();
        });
      }
    }
    else {
      this.heroForm.markAllAsTouched();
      console.error('Invalid form');
    }
  }

  private navigateToRoot() {
    this.router.navigate([`/`]);
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
