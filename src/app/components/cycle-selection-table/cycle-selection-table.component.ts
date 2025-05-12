import { Component, computed, input, output, signal } from '@angular/core';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { ICycle } from '../../../api/mock/mock.model';

interface ICycleRow extends ICycle {
  index?: number;
  availableToday: number;
}

@Component({
  selector: 'cycle-selection-table',
  templateUrl: './cycle-selection-table.component.html',
  styleUrl: './cycle-selection-table.component.scss',
  imports: [FormsModule, MatCheckboxModule, MatIcon, MatTableModule],
})
export class CycleSelectionTable {
  cycles = input.required<ICycle[]>();
  onSelectedCyclesUpdate = output<ICycle[]>();
  selectedCycles = signal<ICycle[]>([]);

  readonly displayedColumns = ['name', 'availableEntities', 'availableToday'];
  readonly dataSource = computed(() => this.parseTableData(this.cycles()));

  parseTableData(cycles: ICycle[]): ICycleRow[] {
    const parsedCycles = cycles.sort(this.priorityCompareFn).map((cycle) => {
      const today = new Date().getDay();
      const events = cycle.structure.find((x) => x.day === today);
      const availableToday = !!events
        ? events.meetings + events.emails + events.calls + events.follows
        : 0;

      return { ...cycle, availableToday };
    });

    return parsedCycles;
  }

  ngOnInit() {
    const highPriority = this.dataSource().filter((c) => c.priority === 'HIGH');
    this.selectedCycles.set(highPriority);

    this.onSelectedCyclesUpdate.emit(this.selectedCycles());
  }

  onCycleChange(event: MatCheckboxChange, cycle: ICycle) {
    if (event.checked) {
      this.selectedCycles.set([...this.selectedCycles(), cycle]);
    } else {
      this.selectedCycles.set(this.selectedCycles().filter((c) => c !== cycle));
    }

    this.onSelectedCyclesUpdate.emit(this.selectedCycles());
  }

  private priorityCompareFn(a: ICycle, b: ICycle): number {
    const order = {
      HIGH: 0,
      MEDIUM: 1,
      LOW: 2,
    };

    return order[a.priority] - order[b.priority];
  }
}
