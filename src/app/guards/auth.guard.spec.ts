import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth-service/auth-service.service';
import { authServiceStubValue } from '../utils/testing/stubs/AuthServiceStubValue';
import { routerStubValue } from '../utils/testing/stubs/RouterStubValue';
import { dummyActivatedRouteSnapshotStubValue } from '../utils/testing/stubs/dummyActivatedRouteSnapshotStubValue';
import { dummyRouterStateStubValue } from '../utils/testing/stubs/dummyRouterStateStubValue';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService, useValue: authServiceStubValue,
        },
        {
          provide: Router, useValue: routerStubValue
        }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow route activation if the user is authenticated', () => {
    authServiceStubValue.currentUserValue = {id: 1, name: 'fake user'};
    const result = TestBed.runInInjectionContext(() => authGuard(dummyActivatedRouteSnapshotStubValue, dummyRouterStateStubValue));
    console.log('authServiceStubValue')
    console.log(authServiceStubValue)
    expect(result).toBeTrue();
    expect(routerStubValue.navigate).not.toHaveBeenCalled();
  })

  it('should NOT allow route activation if the user is authenticated', () => {
    authServiceStubValue.currentUserValue = null;
    const result = TestBed.runInInjectionContext(() => authGuard(dummyActivatedRouteSnapshotStubValue, dummyRouterStateStubValue));
    expect(routerStubValue.navigate).toHaveBeenCalled();
    expect(result).toBeFalse();

  })
});
