import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { authGuard } from './auth.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
  });

  it('should allow activation when the user is logged in', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    spyOn(authenticationService, 'isLoggedIn').and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('should deny activation and redirect to /login when not logged in', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    const router = TestBed.inject(Router);
    spyOn(authenticationService, 'isLoggedIn').and.returnValue(false);
    spyOn(router, 'navigate');

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
