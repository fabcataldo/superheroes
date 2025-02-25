import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeroFormComponent } from './hero-form.component';
import { CommonModule, NgClass } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/hero-service/hero.service';
import { of, throwError } from 'rxjs';
import { AnotherActivatedRouterStub } from '../../utils/testing/stubs/AnotherActivatedRouterStub';
import { HeroServiceStub } from '../../utils/testing/stubs/HeroServiceStub';
import { RouterStubClass } from '../../utils/testing/stubs/RouterStubClass';
import { NotificationsServiceStub } from '../../utils/testing/stubs/NotificationsServiceStub';
import { NotificationsService } from '../../services/notifications-service/notifications.service';


describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let activatedRoute: AnotherActivatedRouterStub;
  let heroService: HeroServiceStub;
  let router: RouterStubClass;
  let notificationsService: NotificationsServiceStub;

  beforeEach(async () => {
    activatedRoute = new AnotherActivatedRouterStub();
    heroService = new HeroServiceStub();
    router = new RouterStubClass();
    notificationsService = new NotificationsServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        HeroFormComponent,
        CommonModule,
        ReactiveFormsModule,
        NgClass,
        LoadingComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: HeroService, useValue: heroService },
        { provide: Router, useValue: router },
        { provide: NotificationsService, useValue: notificationsService },
        FormBuilder
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


    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit Method', () => {
    it('should validate that a hero with a valid id is being obtained, and the form is updated successfully', fakeAsync(() => {
      const heroData = {
        id: 1,
        name: 'Black Panther',
        power: 'Time manipulation',
        weight: 27,
        years: 83,
        description: 'In hac habitasse platea dictumst.'
      };
  
      spyOn(heroService, 'getHero').and.returnValue(of(heroData));
  
      activatedRoute.pushParams({ id: 1 });
      tick(1000);
      fixture.detectChanges();
  
      expect(component.hero()).toEqual(heroData);
      expect({...component.heroForm.value, id: 1}).toEqual(heroData);
      expect(component.loading()).toBeFalse();
    }));
  
    it('should valid that loading signal is setted to false, with a getHero error', fakeAsync(() => {
      spyOn(heroService, 'getHero').and.returnValue(throwError(() =>
        new Error(`Random ERROR`)));
      activatedRoute.pushParams({ id: 250 });
      tick(1000);
      fixture.detectChanges();
      expect(component.loading()).toBeFalse();
    }));
  
    it('should validate that getHero is not called when an invalid id had been sent', fakeAsync(() => {
      spyOn(heroService, 'getHero').and.callThrough();
  
      activatedRoute.pushParams({ id: '0' });
      tick(1000);
      expect(heroService.getHero).not.toHaveBeenCalled();
    }));
  });


  describe('onSubmit Method', () => {
    let fakeFormEvent: Event;

    beforeEach(() => {
      fakeFormEvent = {preventDefault: jasmine.createSpy('preventDefault')} as any as Event;
      const formBuilder: FormBuilder = new FormBuilder();

      component.heroForm = formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            power: [''],
            weight: [''],
            years: [''],
            description: ['', [Validators.required, Validators.minLength(2)]]
      });
    });

    it('should validate that a hero is updated, if the form is valid and that hero exists', fakeAsync(() => {
      const heroToUpdate = {
        id: 2,
        name: 'Thor',
        power: 'Healing factor',
        years: 32,
        weight: 78,
        description: 'Cras fringilla odio ac libero facilisis, id fermentum nisi feugiat.'
      };

      component.heroForm.setValue({
        name: 'New Superhero For Testing',
        description: 'description bla bla blaa',
        power: heroToUpdate.power,
        years: heroToUpdate.years,
        weight: heroToUpdate.weight
      });

      const heroUpdated = {...component.heroForm.value, id: heroToUpdate.id};
      component.hero.set(heroToUpdate);

      spyOn(heroService, 'updateHero').and.returnValue(of(heroUpdated));
      spyOn(component as any, 'navigateToRoot').and.callThrough();

      component.onSubmit(fakeFormEvent);
      tick(1000);

      expect(fakeFormEvent.preventDefault).toHaveBeenCalled();
      expect(heroService.updateHero).toHaveBeenCalledWith(heroUpdated);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(component.loadingSubmitButton()).toBeFalse();
    }));

    it('should validate that a new hero is created, with a valid form', fakeAsync(() => {
      const newHero = {
        name: 'Wonder Woman',
        power: 'Strength',
        weight: 70,
        years: 28,
        description: 'A hero',
        id: 101
      };

      component.heroForm.setValue({
        name: newHero.name,
        description: newHero.description,
        power: newHero.power,
        years: newHero.years,
        weight: newHero.weight
      });

      component.hero.set(undefined);
      spyOn(heroService, 'addHero').and.returnValue(of(newHero));
      spyOn(component as any, 'navigateToRoot').and.callThrough();
      
      component.onSubmit(fakeFormEvent);
      tick(1000);

      expect(heroService.addHero).toHaveBeenCalledWith(component.heroForm.value);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(component.loadingSubmitButton()).toBeFalse();
    }));

    it('should validate that the form is empty, it was touched and is invalid', () => {
      spyOn(component.heroForm, 'markAllAsTouched');     
      
      component.onSubmit(fakeFormEvent);
      fixture.detectChanges();

      expect(component.heroForm.valid).toBeFalse();
      expect(component.heroForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should validate that the form comes invalid through an invalid hero for update', fakeAsync(() => {
      const newHero = {
        name: 'new name Wonder Woman',
        power: 'new power Strength',
        weight: 68,
        years: 28,
        description: 'A hero',
        id: 150
      };

      const heroToUpdate ={
        id: 150,
        name: 'Thor',
        power: 'Healing factor',
        years: 32,
        weight: 78,
        description: 'Cras fringilla odio ac libero facilisis, id fermentum nisi feugiat.'
      };

      component.hero.set(heroToUpdate);

      component.heroForm.setValue({
        name: newHero.name,
        description: newHero.description,
        power: newHero.power,
        years: newHero.years,
        weight: newHero.weight
      });

      spyOn(heroService, 'updateHero').and.returnValue(throwError(()=>
        new Error(`Hero with ID ${heroToUpdate.id} does not exist.`))
      );
      spyOn(console, 'log');
      component.onSubmit(fakeFormEvent);
      tick(1000);
      expect(console.log).toHaveBeenCalledWith(jasmine.any(Error));
      expect(notificationsService.showNotification).toHaveBeenCalledWith(jasmine.any(Error), true);
    }));

    it('should manage an error en addHero heroservice method and notifies it', fakeAsync(() => {
      const newHero = {
        name: 'new name Wonder Woman',
        power: 'new power Strength',
        weight: 68,
        years: 28,
        description: 'A hero',
        id: 101
      };
      component.heroForm.setValue({
        name: newHero.name,
        description: newHero.description,
        power: newHero.power,
        years: newHero.years,
        weight: newHero.weight
      });
      component.hero.set(undefined);
      spyOn(heroService, 'addHero').and.returnValue(throwError(() => new Error('add error')));
      spyOn(console, 'log');
      component.onSubmit(fakeFormEvent);
      tick(1000);
      expect(console.log).toHaveBeenCalledWith(jasmine.any(Error));
      expect(notificationsService.showNotification).toHaveBeenCalledWith(jasmine.any(Error), true);
    }));
  });

  describe('goBack Method', () => {
    it('should validate that this method is called, and router.navigate... is called too', () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });


});
