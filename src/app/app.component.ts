import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewEntitiesModal } from './components/new-entities-modal/new-entities-modal.component';
import { MatButtonModule } from '@angular/material/button';
import mockData from '../api/mock/eventsAPIResponse.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, MatButtonModule],
})
export class AppComponent {
  title = 'case-meetime';

  readonly dialog = inject(MatDialog);

  openDialog() {
    const newEntitiesModalRef = this.dialog.open(NewEntitiesModal, {
      data: mockData,
      width: '800px',
    });

    newEntitiesModalRef.afterClosed().subscribe((result) => {
      //
    });
  }
}
