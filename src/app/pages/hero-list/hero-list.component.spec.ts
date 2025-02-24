import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroListComponent } from './hero-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HeroService } from '../../services/hero-service/hero.service';
import { from, Subject } from 'rxjs';
import { HeroRemovingModalComponent } from './hero-removing-modal/hero-removing-modal.component';
import { heroes } from '../../utils/testing/consts/ExampleHeroes';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroListComponent,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        LoadingComponent,
        MatPaginatorModule,
        MatSortModule
      ],
      providers: [
        HeroService,
        provideAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);

    component = fixture.componentInstance;

    component.subscriptions$ = new Subject<void>();

    spyOn(component, 'updateTableDataSource').and.callThrough();
    spyOn(component.heroService, 'getHeroes').and.callFake(() => from([{heroes, totalHeroes: heroes.length}]));
    spyOn(component, 'goToDetailPage').and.callThrough();
    spyOn(component.router, 'navigate').and.callThrough();
    spyOn(component, 'showDeleteModal').and.callThrough();
    spyOn(component.heroService, 'deleteHero').and.callFake(() => from([heroes[0]]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtain and save heroes data', () => {
    expect(component.localHeroes().length).toBeGreaterThan(0);    
  });

  it('should obtain and save heroes data, and fill the table, validating that has data', () => {
    expect(component.localHeroes().length).toBeGreaterThan(0); 
    expect(component.updateTableDataSource).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });

  it('should validate that, with a click in hero detail button, navigates to hero detail page', () => {
    fixture.nativeElement.querySelector('button[aria-label="detail button"]').click();  
    expect(component.goToDetailPage).toHaveBeenCalledWith(1);
    expect(component.router.navigate).toHaveBeenCalledWith(['/detail', 1]);
  });

  it('should validate that, with a click in hero remove button, delete that hero with id=1', () => {  
    const fakeDialogRef = {
      afterClosed: () => from([true])
    };

    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue(fakeDialogRef as any);

    fixture.nativeElement.querySelector('button[aria-label="delete button"]').click();
    expect(component.showDeleteModal).toHaveBeenCalledWith(1);

    expect(dialogSpy).toHaveBeenCalledWith(HeroRemovingModalComponent, { data: {} });
    expect(component.heroService.deleteHero).toHaveBeenCalledWith(1);
  });
});
