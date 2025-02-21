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
  private _dialogRef = inject(MatDialogRef<HeroRemovingModalComponent>);

  // 🔥 Método para cerrar el modal con confirmación
  confirmDelete(): void {
    this._dialogRef.close(true); // Devuelve `true` para confirmar la eliminación
  }

  // 🔥 Método para cerrar el modal sin acción
  cancel(): void {
    this._dialogRef.close(false); // Devuelve `false` para cancelar
  }
}
