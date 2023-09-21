import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { DeletionProfile } from 'src/models/interfaces/deletion-profile.interface';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
  dataService: FirestoreDataService = inject(FirestoreDataService);

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeletionProfile
  ) {}

  onNoClick() {
    this.dialogRef.close();
  }

  async onYesClick() {
    await this.dataService.deleteDoc(this.getLongType(this.data.type));
    this.dialogRef.close();
  }

  getLongType(type: string) {
    switch (type) {
      case 'Dish':
        return 'dishes/' + this.data.id;
      default:
        return '';
    }
  }
}
