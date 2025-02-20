import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../models/hero.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-hero-form',
  imports: [CommonModule, ReactiveFormsModule, NgClass],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss'
})
export class HeroFormComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _heroService = inject(HeroService);
  private _router = inject(Router);

  hero = signal<Hero | undefined>(undefined);

  heroForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    effect(()=> {
      this._router.navigate([`/`]);
    })

    //FALTA LA EDICIÓN
    this.heroForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      power: [''],
      weight: [''],
      years: [''],
      description: ['', [Validators.required, Validators.minLength(2)]]
    })
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      const currentHero = this._heroService.getHeroes()().find(hero => hero.id === Number(params['id']));
      console.log(params)
      if (currentHero) {
        this.hero.set(currentHero);
      }
    });
  }

  onSubmit(event: Event){
    event.preventDefault();
    if (this.heroForm.valid){
      this._heroService.addHero(this.heroForm.value);
    }
    else {
      this.heroForm.markAllAsTouched();
      console.error('Invalid form');
    }
  }

  hasErrors(field: string, typeError: string) {
    return this.heroForm.get(field)?.hasError(typeError) && this.heroForm.get(field)?.touched;
  }
}
