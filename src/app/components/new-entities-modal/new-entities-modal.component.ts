import { Component, computed, inject, model, signal } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { EventsProjectionChart } from '../events-projection-chart/events-projection-chart.component';
import { CycleSelectionTable } from '../cycle-selection-table/cycle-selection-table.component';
import {
  ICycle,
  IEventsProjection,
  IMockApiResponse,
} from '../../../api/mock/mock.model';
import { countEventsForToday } from '../../../lib/utils';

@Component({
  selector: 'new-entities-modal',
  templateUrl: './new-entities-modal.component.html',
  styleUrl: './new-entities-modal.component.scss',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDivider,
    MatExpansionModule,
    MatInputModule,
    MatIcon,
    CycleSelectionTable,
    EventsProjectionChart,
  ],
})
export class NewEntitiesModal {
  readonly dialogRef = inject(MatDialogRef<this>);
  readonly data = inject<IMockApiResponse>(MAT_DIALOG_DATA);

  readonly entityFormControl = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);

  readonly cycleSelectionOpen = signal(false);
  readonly selectedCycles = signal<ICycle[]>([]);
  readonly entitesValue = model(1);
  readonly eventsProjections = computed(() =>
    this.applyProjections(this.data.eventsProjection, this.selectedCycles())
  );

  readonly eventsToday = computed(() => this.calcEventsToday(this.data.cycles));

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

  private calcEventsToday(cycles: ICycle[]) {
    return cycles.map(countEventsForToday).reduce((a, b) => a + b, 0);
  }

  toggleCycleSelection() {
    this.cycleSelectionOpen.set(!this.cycleSelectionOpen());
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSelectedCyclesUpdate(cycleList: ICycle[]) {
    this.selectedCycles.set(cycleList);
  }
}
