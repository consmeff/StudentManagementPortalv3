import { Injectable, computed, signal } from '@angular/core';
import { LGA, States } from '../data/application/location.dto';
import { ApplicationService } from './application.service';

@Injectable({ providedIn: 'root' })
export class StudentProfileOptionsService {
  readonly countryNames = signal<readonly string[]>([]);

  readonly stateNames = computed(() => this.states().map((state) => state.name));

  private readonly states = signal<readonly States[]>([]);

  private readonly lgasByStateId = signal<Readonly<Record<number, readonly LGA[]>>>({});

  private readonly requestedStateIds = new Set<number>();

  private hasRequestedLocations = false;

  constructor(private readonly applicationService: ApplicationService) {}

  loadLocations(): void {
    if (this.hasRequestedLocations) {
      return;
    }
    this.hasRequestedLocations = true;
    this.applicationService.countries().subscribe({
      next: (response) => this.countryNames.set((response?.data ?? []).map((country) => country.name)),
      error: () => {
        this.hasRequestedLocations = false;
      }
    });
    this.applicationService.states().subscribe({
      next: (response) => this.states.set(response?.data ?? []),
      error: () => {
        this.hasRequestedLocations = false;
      }
    });
  }

  loadLgasForState(stateName: string): void {
    const stateId = this.findStateId(stateName);
    if (stateId === null || this.requestedStateIds.has(stateId)) {
      return;
    }
    this.requestedStateIds.add(stateId);
    this.applicationService.lgas(stateId).subscribe({
      next: (response) => {
        const lgas = response?.data ?? [];
        this.lgasByStateId.update((lgasByStateId) => ({ ...lgasByStateId, [stateId]: lgas }));
      },
      error: () => {
        this.requestedStateIds.delete(stateId);
      }
    });
  }

  lgaNamesForState(stateName: string): readonly string[] {
    return this.lgasForState(stateName).map((lga) => lga.name);
  }

  findLgaId(stateName: string, lgaName: string): number | null {
    const normalizedLgaName = lgaName.trim().toLowerCase();
    return this.lgasForState(stateName).find((lga) => lga.name.toLowerCase() === normalizedLgaName)?.id ?? null;
  }

  private lgasForState(stateName: string): readonly LGA[] {
    const stateId = this.findStateId(stateName);
    return stateId === null ? [] : (this.lgasByStateId()[stateId] ?? []);
  }

  private findStateId(stateName: string): number | null {
    const normalizedStateName = stateName.trim().toLowerCase();
    if (!normalizedStateName) {
      return null;
    }
    return this.states().find((state) => state.name.toLowerCase() === normalizedStateName)?.id ?? null;
  }
}
