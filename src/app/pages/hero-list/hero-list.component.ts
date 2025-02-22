import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { HeroService } from '../../services/hero.service';
import {MatButtonModule} from '@angular/material/button';
import { Hero } from '../../models/hero.model';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';
import {
  MatDialog,
} from '@angular/material/dialog';
import { HeroRemovingModalComponent } from './hero-removing-modal/hero-removing-modal.component';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


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
  public router = inject(Router);
  dialog = inject(MatDialog);
  heroService: HeroService = inject(HeroService);
  localHeroes = signal<Hero[]>([]);
  displayedColumns: string[] = ['name', 'power', 'actions'];
  loading = signal(true);
  subscriptions$ = new Subject<void>();
  dataSource = new MatTableDataSource<Hero>([]);

  ngOnInit(): void {
    this.loading.set(true);
    this.heroService.getHeroes().pipe(takeUntil(this.subscriptions$)).subscribe(res => {
      this.localHeroes.set(res);
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
        this.heroService.deleteHero(idHero).pipe(takeUntil(this.subscriptions$)).subscribe(res => {
          this.loading.set(true);
          this.heroService.getHeroes().pipe(takeUntil(this.subscriptions$)).subscribe(res => {
            this.localHeroes.set(res);
            this.updateTableDataSource();
            this.loading.set(false);
          });
        });;
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
          return this.compare(a.name, b.name, isAsc);
        case 'power':
          return this.compare(a.power, b.power, isAsc);
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

  updateTableDataSource() {
    this.dataSource = new MatTableDataSource(this.localHeroes());
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
