import { AfterViewInit, Component, ElementRef, inject, model, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { HeroService } from '../../services/hero-service/hero.service';
import {MatButtonModule} from '@angular/material/button';
import { Hero } from '../../models/hero.model';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';
import {
  MatDialog,
} from '@angular/material/dialog';
import { HeroRemovingModalComponent } from './hero-removing-modal/hero-removing-modal.component';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NotificationsService } from '../../services/notifications-service/notifications.service';


@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, LoadingComponent, MatPaginatorModule, MatSortModule],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss'
})
export class HeroListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild('searchInput') searchInput!: ElementRef;
  public router = inject(Router);
  dialog = inject(MatDialog);
  heroService: HeroService = inject(HeroService);
  private _notificationsService = inject(NotificationsService);
  localHeroes = signal<Hero[]>([]);
  displayedColumns: string[] = ['name', 'power', 'actions'];
  loading = signal(true);
  subscriptions$ = new Subject<void>();
  dataSource = new MatTableDataSource<Hero>([]);
  protected heroSearched = model('');
  filteredHeroes = signal<Hero[]>([]);

  pageSize = signal(5);
  currentPage = signal(0);
  totalHeroes = signal(0);

  ngOnInit(): void {
    this.loading.set(true);
    this.getHeroes();
  }

  private getHeroes() {
    this.heroService.getHeroes(this.currentPage(), this.pageSize())
    .pipe(takeUntil(this.subscriptions$)).subscribe(res => {
      this.localHeroes.set(res.heroes);
      this.totalHeroes.set(res.totalHeroes);
      this.updateTableDataSource();
      this.loading.set(false);
    });
  }

  
  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    fromEvent<Event>(this.searchInput.nativeElement, 'input').pipe(
      debounceTime(300),
      map((event: Event) => (event.target as HTMLInputElement).value),
      distinctUntilChanged()
    ).subscribe(value => {
      this.heroSearched.set(value);
      this.applyFilter();
    });
  }


  goToEditPage(idHero: number){
    this.router.navigate([`/create-edit`, idHero]);
  }

  goToDetailPage(idHero: number) {
    this.router.navigate([`/detail`, idHero]);
  }

  showDeleteModal(idHero: number) {
    const dialogRef = this.dialog.open(HeroRemovingModalComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroService.deleteHero(idHero).pipe(takeUntil(this.subscriptions$))
        .subscribe({
          next: (res) => {
            this.loading.set(true);
            this.heroService.getHeroes(1, this.pageSize()).pipe(takeUntil(this.subscriptions$))
            .subscribe({
              next: (getRes) => {
                this.localHeroes.set(getRes.heroes);
                this.totalHeroes.set(getRes.totalHeroes);
                this.updateTableDataSource();
                this.loading.set(false);
              },
              error: (err) => {
                console.log(err);
                this._notificationsService.showNotification(err, true);
                this.loading.set(false);
              }
            });
          },
          error: (err) => {
            console.log(err);
            this._notificationsService.showNotification(err, true);
            this.loading.set(false);
          }
        });
      }
    });
  }

  sortData(sort: Sort) {
    let data = this.localHeroes().slice();

    if (!sort.active || sort.direction === '') {
      this.localHeroes.set(data);
      return;
    }

    data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compareTableItems(a.name, b.name, isAsc);
        case 'power':
          return this.compareTableItems(a.power, b.power, isAsc);
        default:
          return 0;
      }
    })
    this.localHeroes.update(() => data);
    this.updateTableDataSource();
  }

  goToCreateHero() {
    this.router.navigate([`/create-edit`]);
  }

  updateTableDataSource(isFiltering?: boolean) {
    this.dataSource = new MatTableDataSource(isFiltering ? this.filteredHeroes() : this.localHeroes());
  }

  private compareTableItems(a: number | string | undefined, b: number | string | undefined, isAsc: boolean) {
    return (a!! < b!! ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(): void {
    this.heroService.getFilteredHeroesByText(this.heroSearched(), this.currentPage(), this.pageSize()).pipe(takeUntil(this.subscriptions$)).subscribe({
      next: (res) => {
        this.filteredHeroes.set(res);
        this.updateTableDataSource(true);
      },
      error: (err) => {
        console.log(err);
        this._notificationsService.showNotification(err, true);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.currentPage.set(event.pageIndex);
    this.getHeroes();
  }
}
