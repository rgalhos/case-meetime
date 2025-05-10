import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import {
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'new-entities-modal',
  templateUrl: './new-entities-modal.component.html',
  styleUrl: './new-entities-modal.component.scss',
  imports: [
    MatButton,
    MatDialogTitle,
    MatDialogContent,
    MatCard,
    MatCardTitle,
    MatCardContent,
  ],
})
export class NewEntitiesModal {
  readonly dialogRef = inject(MatDialogRef<this>);

  closeDialog() {
    this.dialogRef.close();
  }
}
