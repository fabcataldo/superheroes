import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthService } from './auth-service.service';
import { User } from '../../models/user.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login() work, "logining" a user succesffully', fakeAsync(() => {
    let user: User = {
      id: '1',
      username: "pepe",
      email: "pepe@gmail.com",
      password: "123"
  }
    let result = {};
    service.login(user.email, user.password).subscribe(data => result = data);
    tick(1000);
    expect(result).toEqual({token: 'fake-token', email: user.email});
    const userStored = localStorage.getItem('currentUser');
    expect(userStored).not.toBeNull();
    expect(JSON.parse(userStored as string).email).toEqual(user.email);
  }));

  it('should login() work, but "logining" a user without success', fakeAsync(() => {
    let user: User = {
      id: '1',
      username: "pepe",
      email: "pepe2@gmail.com",
      password: "123"
  }
    let result = {};
    let resultError: any;
    service.login(user.email, user.password)
    .subscribe({
      next: (res) => {
        result = res;
      },
      error: (err) => {
        resultError = err;
      }
    });
    tick(1000);
    expect(resultError.message.length).toBeGreaterThan(0)
  }));

  it('should logout() work, "logouting" a user', fakeAsync(() => {
    let user: User = {
      id: '1',
      username: "pepe",
      email: "pepe@gmail.com",
      password: "123"
  }
    let result = {};
    service.login(user.email, user.password).subscribe(data => result = data);
    tick(1000);
    expect(result).toEqual({token: 'fake-token', email: user.email});
   
  }));
});
