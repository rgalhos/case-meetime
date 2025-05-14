import {
  Component,
  computed,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ICycle } from '../../../api/mock/mock.model';
import { countEventsForToday } from '../../../lib/utils';

interface ICycleRow extends ICycle {
  index?: number;
  entities: number;
  availableToday: number;
}

@Component({
  selector: 'cycle-selection-table',
  templateUrl: './cycle-selection-table.component.html',
  styleUrl: './cycle-selection-table.component.scss',
  imports: [MatCheckboxModule, MatIcon, MatTableModule],
  encapsulation: ViewEncapsulation.None,
})
export class CycleSelectionTable {
  cycles = input.required<ICycle[]>();
  entitesValue = input.required<number>();
  onSelectedCyclesUpdate = output<ICycle[]>();
  selectedCycles = signal<ICycle[]>([]);

  readonly displayedColumns = ['name', 'availableEntities', 'availableToday'];
  readonly secondHeaderRow = ['info'];
  readonly dataSource = computed(() => this.formatTableData(this.cycles()));

  formatTableData(cycles: ICycle[]): ICycleRow[] {
    let distrEntitiesValue = this.entitesValue();

    const parsedCycles = cycles.sort(this.priorityCompareFn).map((cycle) => {
      const availableToday = countEventsForToday(cycle);
      const entities = Math.min(distrEntitiesValue, cycle.availableEntities);
      distrEntitiesValue -= entities;

      (<ICycleRow>cycle).entities = entities;
      (<ICycleRow>cycle).availableToday = availableToday;

      return cycle as ICycleRow;
    });

    return parsedCycles;
  }

  ngOnInit() {
    const highPriority = this.dataSource().filter((c) => c.priority === 'HIGH');
    this.selectedCycles.set(highPriority);
    this.onSelectedCyclesUpdate.emit(this.selectedCycles());
  }

  ngOnChanges() {
    for (const cycle of this.dataSource()) {
      if (
        cycle.entities === cycle.availableEntities &&
        !this.selectedCycles().includes(cycle)
      ) {
        this.selectedCycles.set([...this.selectedCycles(), cycle]);
      }
    }

    this.onSelectedCyclesUpdate.emit(this.selectedCycles());
  }

  onCycleChange(event: MatCheckboxChange, cycle: ICycle) {
    if (event.checked) {
      this.addCycle(cycle);
    } else {
      this.removeCycle(cycle);
    }
  }

  private addCycle(cycle: ICycle) {
    this.selectedCycles.set([...this.selectedCycles(), cycle]);
    this.onSelectedCyclesUpdate.emit(this.selectedCycles());
  }

  private removeCycle(cycle: ICycle) {
    this.selectedCycles.set(this.selectedCycles().filter((c) => c !== cycle));
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
