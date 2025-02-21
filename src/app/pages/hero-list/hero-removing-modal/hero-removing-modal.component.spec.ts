import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroRemovingModalComponent } from './hero-removing-modal.component';

describe('HeroRemovingModalComponent', () => {
  let component: HeroRemovingModalComponent;
  let fixture: ComponentFixture<HeroRemovingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroRemovingModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroRemovingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
