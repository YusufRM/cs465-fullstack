import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent implements OnInit {

  @Input('trip') trip: any;
  @Output() tripDeleted = new EventEmitter<string>();

  constructor(
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
  }

  public editTrip(trip: Trip): void {
    // Stash the trip code so the edit-trip component knows which record to load
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['/edit-trip']);
  }

  public deleteTrip(trip: Trip): void {
    if (!confirm(`Delete trip "${trip.name}" (${trip.code})? This cannot be undone.`)) {
      return;
    }
    this.tripDataService.deleteTrip(trip.code)
      .subscribe({
        next: (value: any) => {
          console.log('Deleted trip: ' + trip.code);
          this.tripDeleted.emit(trip.code);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }
}
