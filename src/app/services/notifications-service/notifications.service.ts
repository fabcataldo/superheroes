import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  showNotification(msg: string){
    this._snackBar.open(msg, undefined, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
