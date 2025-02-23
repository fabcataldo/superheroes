import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, switchMap, throwError } from 'rxjs';
import { users } from '../../utils/testing/consts/ExampleUsers';
import { User } from '../../models/user.model';

export interface AuthResponse {
  token: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersDB = signal<User[]>(users);
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const userOnDB = this.usersDB().find(user => user.email === email && user.password === password);
    return of(userOnDB).pipe(
      delay(1000),
      switchMap(foundUser => {
        if (!foundUser) {
          return throwError(() => new Error('Invalid credentials'));
        }

        const response: AuthResponse = { token: 'fake-token', email: foundUser.email };
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
        return of(response);
      })
    )
  }

  logout(): Observable<boolean> {
    return of(true).pipe(
      switchMap(hero => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        return of(true);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const userInDB = this.usersDB().some(user => user.email === email);
    return of(null).pipe(
      delay(1000),
      switchMap(() => {
        if(userInDB) {
          return throwError(() => new Error('User Exists'));
        }

        this.usersDB.update(currentUsers => [...currentUsers, {email, username, password, id: crypto.randomUUID()}]);
        const response: AuthResponse = {token: 'fake-token', email};
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
        return of(response);
      })
    )
  }

  get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }
}
