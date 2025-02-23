import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroFormComponent } from './hero-form.component';
import { CommonModule, NgClass } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/hero-service/hero.service';
import { FakeRouter } from '../../utils/testing/FakeRouter';
import { FakeActivatedRoute } from '../../utils/testing/FakeActiveRoute';
import { heroes } from '../../utils/testing/consts/ExampleHeroes';
import { from, of } from 'rxjs';


describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroFormComponent,
        CommonModule,
        ReactiveFormsModule,
        NgClass,
        LoadingComponent,
      ],
      providers: [
        HeroService,
        { provide: Router, useClass: FakeRouter },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;

    const formBuilder: FormBuilder = new FormBuilder();

    component.heroForm = formBuilder.group({
          name: ['', [Validators.required, Validators.minLength(2)]],
          power: [''],
          weight: [''],
          years: [''],
          description: ['', [Validators.required, Validators.minLength(2)]]
    });

    spyOn(component.heroService, 'getHero').and.callFake(() => from([heroes[0]]));

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate incorrect form filled', () => {
    fixture.nativeElement.querySelector('button').click();
    expect(component.heroForm.status).toEqual("INVALID");
  });

  it('should validate correct required fields', () => {
    const formBuilder: FormBuilder = new FormBuilder();

    component.heroForm = formBuilder.group({
      name: 'New Superhero For Testing',
      description: 'description bla bla blaa'
    });
    fixture.nativeElement.querySelector('button').click();

    expect(component.heroForm.valid).toBeTruthy();
  });

});
