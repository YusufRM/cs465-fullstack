import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';

// Build a syntactically valid (unsigned) JWT with the given payload so we can
// exercise isLoggedIn()/getCurrentUser() without hitting a real API.
function fakeToken(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    localStorage.removeItem('travlr-token');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthenticationService);
  });

  afterEach(() => {
    localStorage.removeItem('travlr-token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should report not logged in when there is no token', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should report logged in with a valid, unexpired token', () => {
    const token = fakeToken({ email: 'a@b.com', name: 'A B', exp: (Date.now() / 1000) + 3600 });
    service.saveToken(token);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should report not logged in with an expired token', () => {
    const token = fakeToken({ email: 'a@b.com', name: 'A B', exp: (Date.now() / 1000) - 3600 });
    service.saveToken(token);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should clear the token on logout', () => {
    service.saveToken(fakeToken({ email: 'a@b.com', name: 'A B', exp: (Date.now() / 1000) + 3600 }));
    service.logout();
    expect(service.getToken()).toBe('');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should read the current user back out of the token payload', () => {
    const token = fakeToken({ email: 'admin@travlr.com', name: 'Admin User', exp: (Date.now() / 1000) + 3600 });
    service.saveToken(token);
    const user = service.getCurrentUser();
    expect(user.email).toBe('admin@travlr.com');
    expect(user.name).toBe('Admin User');
  });
});
