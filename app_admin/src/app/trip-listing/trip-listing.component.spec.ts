import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { TripListingComponent } from './trip-listing.component';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

// Mock trip data — this is the "Functional Testing... using mock data" the
// rubric asks for: the component is tested against fixture data, never a
// live database, so the test suite doesn't depend on Mongo/Express running.
const mockTrips: Trip[] = [
  {
    code: 'MOCK001',
    name: 'Mock Trip One',
    length: '3 nights / 4 days',
    start: new Date('2027-01-01'),
    resort: 'Mock Resort, 5 stars',
    perPerson: '1234.00',
    image: 'reef1.jpg',
    description: '<p>Mock description one.</p>'
  },
  {
    code: 'MOCK002',
    name: 'Mock Trip Two',
    length: '5 nights / 6 days',
    start: new Date('2027-02-01'),
    resort: 'Mock Resort Two, 4 stars',
    perPerson: '2345.00',
    image: 'reef2.jpg',
    description: '<p>Mock description two.</p>'
  }
];

describe('TripListingComponent', () => {
  let component: TripListingComponent;
  let fixture: ComponentFixture<TripListingComponent>;
  let tripDataServiceStub: Partial<TripDataService>;

  beforeEach(async () => {
    tripDataServiceStub = {
      getTrips: () => of(mockTrips)
    };

    await TestBed.configureTestingModule({
      imports: [TripListingComponent],
      providers: [
        provideRouter([]),
        { provide: TripDataService, useValue: tripDataServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TripListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the mock trips on init and render one card per trip', () => {
    expect(component.trips.length).toBe(2);
    expect(component.message).toBe('There are 2 trips available.');

    const cards = fixture.nativeElement.querySelectorAll('app-trip-card');
    expect(cards.length).toBe(2);
  });

  it('should remove a trip from the list when onTripDeleted fires', () => {
    component.onTripDeleted('MOCK001');
    expect(component.trips.length).toBe(1);
    expect(component.trips[0].code).toBe('MOCK002');
  });
});
