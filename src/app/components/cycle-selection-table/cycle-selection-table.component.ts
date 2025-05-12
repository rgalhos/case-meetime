import {
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  output,
  Output,
  signal,
} from '@angular/core';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { ECyclePriority, ICycle } from '../../../api/mock/mock.model';

interface ICycleRow extends ICycle {
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
  onCycleSelection = output<ICycle>();
  onCycleRemoval = output<ICycle>();
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

  onCycleChange(event: MatCheckboxChange, cycle: ICycle) {
    if (event.checked) {
      this.onCycleSelection.emit(cycle);
    } else {
      this.onCycleRemoval.emit(cycle);
    }
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
