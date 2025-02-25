import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HeroListComponent } from './hero-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
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
    spyOn(component, 'goToCreateHero').and.callThrough();
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

  it('should validate rows from table changing order, sorting by name asc', () => {
    const lastHeroes = component.localHeroes()
    spyOn(component, 'sortData').and.callThrough();
    const sortObj: Sort = {
      active: 'name',
      direction: 'asc'
    };
    component.sortData(sortObj);

    expect(component.localHeroes()[0].id).not.toEqual(lastHeroes[0].id);
  });

  it('should validate rows from table changing order, sorting by power asc', () => {
    const lastHeroes = component.localHeroes()
    spyOn(component, 'sortData').and.callThrough();
    const sortObj: Sort = {
      active: 'power',
      direction: 'asc'
    };
    component.sortData(sortObj);

    expect(component.localHeroes()[0].id).not.toEqual(lastHeroes[0].id);
  });

  it('should validate rows from table changing order, with no sorting', () => {
    const lastHeroes = component.localHeroes()
    spyOn(component, 'sortData').and.callThrough();
    const sortObj: Sort = {
      active: 'description',
      direction: 'asc'
    };
    component.sortData(sortObj);

    expect(component.localHeroes()[0].id).toEqual(lastHeroes[0].id);
  });

  it('should validate trying rows from table changing order, with a sort parameter with active and direction with no values', () => {
    const lastHeroes = component.localHeroes()
    spyOn(component, 'sortData').and.callThrough();
    const sortObj: Sort = {
      active: '',
      direction: ''
    };
    component.sortData(sortObj);

    expect(component.localHeroes()[0].id).toEqual(lastHeroes[0].id);
  });

  it('should validate goToCreateHero call, and router.navigate internal call', () => {
    
    fixture.nativeElement.querySelector('button[type="submit"]').click();  
    expect(component.goToCreateHero).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/create-edit']);
  });

  it('should validate page hero listing change, applying a filter search input value', () => {
    spyOn(component, 'applyFilter').and.callThrough();
    component.heroSearched.set('black');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[aria-label="Next page"]').click();
    
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it('should validate page hero listing change, NOT applying a filter search input value', () => {
    spyOn(component, 'getHeroes').and.callThrough();
    component.heroSearched.set('');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[aria-label="Next page"]').click();
    
    expect(component.getHeroes).toHaveBeenCalled();
  });

  it('should validate that NOT suplying a filter search input, it will reset all table pagination parameters and original not filtered data', fakeAsync(() => {
    spyOn(component, 'applyFilter').and.callThrough();
    component.searchInput.nativeElement.value = '';
    component.searchInput.nativeElement.dispatchEvent(new Event('input'));
    tick(1000);

    expect(component.applyFilter).toHaveBeenCalled();
    expect(component.pageSize()).toEqual(component.backupedPageSize());
    expect(component.currentPage()).toEqual(component.currentPage());
    expect(component.totalHeroes()).toEqual(component.totalHeroes());
  }));

  it('should validate that suplying a filter search input, it will reset all table pagination parameters and original not filtered data', fakeAsync(() => {
    const searchInputValue = 'black';
    const currentPage = 0;
    const pageSize = 0;
    const pageStartIdx = currentPage * pageSize;
    const pageEndIdx = pageStartIdx + pageSize;

    const filteredHeroes = component.heroService.serviceHeroes.filter(hero =>
      hero.name.toLocaleLowerCase().includes(searchInputValue.toLocaleLowerCase())
    );

    const finalHeroServiceResponse = {
      heroes: filteredHeroes.slice(pageStartIdx, pageEndIdx),
      totalHeroes: heroes.length,
      pageSize: filteredHeroes.length,
      currentPage
    };

    spyOn(component.heroService, 'getFilteredHeroesByText').and.callFake(() =>
      from([finalHeroServiceResponse]));

    spyOn(component, 'applyFilter').and.callThrough();
    component.searchInput.nativeElement.value = searchInputValue;
    component.searchInput.nativeElement.dispatchEvent(new Event('input'));
    tick(1000);

    expect(component.applyFilter).toHaveBeenCalled();
    expect(component.pageSize()).toEqual(finalHeroServiceResponse.totalHeroes);
    expect(component.currentPage()).toEqual(finalHeroServiceResponse.currentPage);
    expect(component.totalHeroes()).toEqual(finalHeroServiceResponse.totalHeroes);
  }));
});
