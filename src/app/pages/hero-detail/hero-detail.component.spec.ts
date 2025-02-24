import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';
import { HeroService } from '../../services/hero-service/hero.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FakeRouter } from '../../utils/testing/FakeRouter';
import { FakeLocation } from '../../utils/testing/FakeLocation';
import { from, of } from 'rxjs';
import { heroes } from '../../utils/testing/consts/ExampleHeroes';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroDetailComponent,
        LoadingComponent,
        CommonModule
      ],
      providers: [
        HeroService,
        { provide: Router, useClass: FakeRouter },
        { provide: ActivatedRoute, useValue: {
          params: of({ id: '1' }),
          snapshot: { paramMap: convertToParamMap({ id: '1' }) }
        } },
        { provide: Location, useClass: FakeLocation}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    spyOn(component.heroService, 'getHero').and.callFake(() => from([heroes[0]]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have route param id equal to "1"', () => {
    expect(component.route.snapshot.paramMap.get('id')).toEqual('1');

    component.route.params.subscribe(params => {
      expect(params['id']).toEqual('1');
      expect(component.heroService.getHero).toHaveBeenCalledWith(1);
      expect(component.hero()?.id).toEqual(1);
    });
  });
});
