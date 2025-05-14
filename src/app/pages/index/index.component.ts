import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { NewEntitiesModal } from '../../components/new-entities-modal/new-entities-modal.component';
import { fetchMockApi } from '../../../api/mock/mock.service';
import { ICycle, IMockApiResponse } from '../../../api/mock/mock.model';

@Component({
  selector: 'index-page',
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  imports: [MatButtonModule, MatIcon],
})
export class IndexComponent {
  title = 'case-meetime';

  readonly activatedRoute = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);
  readonly selectedCycles = signal<ICycle[]>([]);
  mockData?: IMockApiResponse;

  ngOnInit() {
    fetchMockApi().then((data) => {
      this.mockData = data;
      this.openNewEntitiesModal();
    });
  }

  openNewEntitiesModal() {
    if (!this.mockData) return;

    const newEntitiesModalRef = this.dialog.open(NewEntitiesModal, {
      data: this.mockData,
      width: '800px',
    });

    newEntitiesModalRef.afterClosed().subscribe((result) => {
      void result;
    });
  }
}
