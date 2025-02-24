import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-hero-removing-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './hero-removing-modal.component.html',
  styleUrl: './hero-removing-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroRemovingModalComponent {
  public dialogRef = inject(MatDialogRef<HeroRemovingModalComponent>);

  confirmDelete(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
