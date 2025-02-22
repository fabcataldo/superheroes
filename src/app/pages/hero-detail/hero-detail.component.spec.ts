import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';
import { HeroService } from '../../services/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FakeRouter } from '../../utils/testing/FakeRouter';
import { FakeActivatedRoute } from '../../utils/testing/FakeActiveRoute';
import { FakeLocation } from '../../utils/testing/FakeLocation';

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
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Location, useClass: FakeLocation}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //caso de pruebas:
  //que se busca un hero con id tanto, y en el signal aparece el hero posta
});
