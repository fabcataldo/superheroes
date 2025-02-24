import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroRemovingModalComponent } from './hero-removing-modal.component';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('HeroRemovingModalComponent', () => {
  let component: HeroRemovingModalComponent;
  let fixture: ComponentFixture<HeroRemovingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroRemovingModalComponent,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
      ],
      providers:[
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroRemovingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate working of at least one of dialog component buttons', () => {
    const spy = spyOn( component, 'cancel' );
    fixture.nativeElement.querySelector('button').click();    
    expect(spy).toHaveBeenCalled();
  });
});
