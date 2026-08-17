import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a validation error and not attempt login when a field is missing', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    spyOn(authenticationService, 'login');

    component.credentials = { name: '', email: 'a@b.com', password: 'secret123' };
    component.onLoginSubmit();

    expect(component.formError).toContain('required');
    expect(authenticationService.login).not.toHaveBeenCalled();
  });

  it('should call AuthenticationService.login when all fields are present', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    spyOn(authenticationService, 'login');
    spyOn(authenticationService, 'isLoggedIn').and.returnValue(false);

    component.credentials = { name: 'Admin User', email: 'admin@travlr.com', password: 'secret123' };
    component.onLoginSubmit();

    expect(component.formError).toBe('');
    expect(authenticationService.login).toHaveBeenCalledWith(
      jasmine.objectContaining({ name: 'Admin User', email: 'admin@travlr.com' }),
      'secret123'
    );
  });
});
