import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

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
  ],
})
export class NewEntitiesModal {
  readonly dialogRef = inject(MatDialogRef<this>);
  readonly cycleSelectionOpen = signal(false);

  toggleCycleSelection() {
    this.cycleSelectionOpen.set(!this.cycleSelectionOpen());
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
