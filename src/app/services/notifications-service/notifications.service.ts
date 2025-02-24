import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  showNotification(msg: string, isError?: boolean){
    this._snackBar.open(msg, undefined, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: !isError ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
