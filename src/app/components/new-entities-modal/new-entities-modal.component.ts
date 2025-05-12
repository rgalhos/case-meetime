import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { EventsProjectionChart } from '../events-projection-chart/events-projection-chart.component';
import {
  ICycle,
  ICycleEvent,
  IEvent,
  IEventsProjection,
  IMockApiResponse,
} from '../../../api/mock/mock.model';
import { CycleSelectionTable } from '../cycle-selection-table/cycle-selection-table.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'new-entities-modal',
  templateUrl: './new-entities-modal.component.html',
  styleUrl: './new-entities-modal.component.scss',
  imports: [
    MatCardModule,
    MatDialogTitle,
    MatDialogContent,
    MatDivider,
    MatExpansionModule,
    MatTreeModule,
    MatIcon,
    CycleSelectionTable,
    EventsProjectionChart,
  ],
})
export class NewEntitiesModal {
  readonly dialogRef = inject(MatDialogRef<this>);
  readonly data = inject<IMockApiResponse>(MAT_DIALOG_DATA);
  readonly cycleSelectionOpen = signal(true);
  readonly selectedCycles = signal<ICycle[]>([]);
  readonly eventsProjections = computed(() =>
    this.applyProjections(this.data.eventsProjection, this.selectedCycles())
  );

  private applyProjections(
    projections: IEventsProjection[],
    selectedCycles: ICycle[]
  ) {
    if (selectedCycles.length === 0) {
      return projections;
    }

    const newProjections: IEventsProjection[] = [];

    for (const currDay in projections) {
      const currEvent = projections[currDay];

      const newEvents = selectedCycles
        .map((c) => c.structure.find(({ day }) => day === currEvent.day))
        .filter((c) => !!c)
        .reduce(
          (a, b) => ({
            calls: a.calls + b.calls,
            emails: a.emails + b.emails,
            follows: a.follows + b.follows,
            meetings: a.meetings + b.meetings,
          }),
          currEvent.events
        );

      newProjections.push({
        day: currEvent.day,
        events: newEvents,
      });
    }


    return newProjections;
  }

  toggleCycleSelection() {
    this.cycleSelectionOpen.set(!this.cycleSelectionOpen());
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onCycleSelection(cycle: ICycle) {
    console.log('novo', { cycle });
    this.selectedCycles.set([...this.selectedCycles(), cycle]);
  }

  onCycleRemoval(cycle: ICycle) {
    this.selectedCycles.set(this.selectedCycles().filter((x) => x !== cycle));
  }
}
