import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TagsDataSource, TagsItem } from '../tags/tags-datasource';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { FormControl } from '@angular/forms';
import { DocumentReference, addDoc, updateDoc } from 'firebase/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterTableService } from 'src/app/core/services/filter-table.service';

@Component({
  selector: 'app-dishes-overview',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TagsItem>;
  @ViewChild('input') input!: ElementRef;
  addingTag = new FormControl('');
  dataSource = new TagsDataSource();
  dataService: FirestoreDataService = inject(FirestoreDataService);
  filterService: FilterTableService = inject(FilterTableService);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['tag'];
  selected: string = '';

  constructor(private _snackBar: MatSnackBar) {}

  ngAfterViewInit(): void {
    this.dataService.tagColl$.subscribe((data) => {
      this.dataSource.data = data;
      this.table.dataSource = this.dataSource;
    });
    this.prepareData();
  }

  prepareData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filter() {
    this.table.dataSource = this.dataSource;
    if (this.filterService.inputValue(this.input).length != 0) {
      this.table.dataSource = this.filtered();
    }
    this.prepareData();
  }

  filtered() {
    return this.dataSource.data.filter((item) =>
      this.filterService.isPartOfString(
        item.tag,
        this.filterService.inputValue(this.input)
      )
    );
  }

  async addTag() {
    let arr: string[] = [];
    this.dataSource.data.forEach((e) => {
      arr.push(e.tag);
    });
    let newTag =
      this.filterService.inputValue(this.input).charAt(0).toUpperCase() +
      this.filterService.inputValue(this.input).slice(1);
    if (!arr.includes(newTag)) {
      await this.syncWithFirebaseTags(newTag);
      this.addingTag.reset();
    } else {
      this.addingTag.setErrors({ exists: true });
    }
  }

  async syncWithFirebaseTags(newTag: string) {
    try {
      await addDoc(this.dataService.coll('tags'), {
        usage: 0,
        tag: newTag,
      }).then((doc: DocumentReference) => {
        updateDoc(doc, {
          id: doc.id,
        });
      });
      this._snackBar.open('"' + newTag + '"-Tag added.', 'OK', {
        duration: 5000,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
