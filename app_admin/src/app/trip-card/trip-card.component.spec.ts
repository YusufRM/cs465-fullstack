import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { TripCardComponent } from './trip-card.component';
import { Trip } from '../models/trip';

// Mock trip data used to test rendering without touching the real API/database
const mockTrip: Trip = {
  code: 'MOCK001',
  name: 'Mock Trip',
  length: '3 nights / 4 days',
  start: new Date('2027-01-01'),
  resort: 'Mock Resort, 5 stars',
  perPerson: '1234.00',
  image: 'reef1.jpg',
  description: '<p>Mock description for testing.</p>'
};

describe('TripCardComponent', () => {
  let component: TripCardComponent;
  let fixture: ComponentFixture<TripCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripCardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TripCardComponent);
    component = fixture.componentInstance;
    component.trip = mockTrip;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the mock trip name and resort', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card-header')?.textContent).toContain('Mock Trip');
    expect(el.textContent).toContain('Mock Resort, 5 stars');
  });

  it('should emit tripDeleted with the trip code when a trip is deleted', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    let emittedCode: string | undefined;
    component.tripDeleted.subscribe((code: string) => emittedCode = code);

    // Avoid a real HTTP call in this unit test by stubbing the service call
    (component as any).tripDataService.deleteTrip = () => ({
      subscribe: (handlers: any) => handlers.next({})
    });

    component.deleteTrip(mockTrip);
    expect(emittedCode).toBe('MOCK001');
  });
});
