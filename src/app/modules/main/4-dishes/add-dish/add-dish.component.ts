import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentReference, addDoc, updateDoc } from 'firebase/firestore';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { CurrencyFormatterService } from 'src/app/core/services/currency-formatter.service';
import { FilterTableService } from 'src/app/core/services/filter-table.service';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { Dish } from 'src/models/classes/dish.class';
import { DishProfile } from 'src/models/interfaces/dish-profile.interface';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.scss'],
})
export class AddDishComponent implements AfterViewInit {
  @ViewChild('currency') currency!: ElementRef;
  @ViewChild('search') search!: ElementRef;
  private fb = inject(FormBuilder);
  dataService: FirestoreDataService = inject(FirestoreDataService);
  currencyService: CurrencyFormatterService = inject(CurrencyFormatterService);
  dataToEdit = new Dish();
  id: string | undefined;
  tagList: string[] = [];
  tagListSave: string[] = [];
  filterService: FilterTableService = inject(FilterTableService);
  dishForm!: FormGroup;

  constructor(private _snackBar: MatSnackBar, private router: Router) {
    this.id = window.history.state.id || undefined;
    this.initForm();
    this.dataService.tagColl$.subscribe((data) => {
      data.forEach((e) => {
        this.tagList.push(e.tag);
        this.tagListSave.push(e.tag);
      });
    });
  }

  async ngAfterViewInit() {
    await this.getEditable();
    this.initForm();
  }

  initForm() {
    this.dishForm = this.fb.group({
      name: [this.dataToEdit.name || null, Validators.required],
      text: [this.dataToEdit.text || null],
      cost: new FormControl(this.dataToEdit.cost || '€0.00', {
        nonNullable: true,
        validators: [this.priceError()],
      }),
      tags: [this.dataToEdit.tags || ''],
    });
  }

  async getEditable() {
    if (this.id) {
      this.dataToEdit = new Dish(
        (await this.dataService.getDocData('dishes/' + this.id)) as DishProfile
      );
    }
  }

  formatCurrency() {
    let current = this.currency.nativeElement;
    if (current.value.length <= 1) {
      current.value = '€0.00' + current.value;
    }
    current.value = this.currencyService.rtl(current.value);
    this.dishForm.controls['cost'].setValue(current.value);
  }

  priceError(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const price = parseInt(value.slice(1, value.length));
      return price < 1 ? { cost: value } : null;
    };
  }

  async onSubmit(): Promise<void> {
    if (this.dishForm.valid) {
      try {
        if (this.id) {
          await this.editDish();
        } else {
          await this.newDish();
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }

  async editDish() {
    await this.dataService.update('dishes/' + this.id, this.dishForm.value);
    this._snackBar.open(
      '"' + this.dishForm.controls['name'].value + '" successfully edited',
      undefined,
      { duration: 3000 }
    );
    this.router.navigate(['dishes/list']);
  }

  async newDish() {
    await addDoc(this.dataService.coll('dishes'), this.dishForm.value).then(
      (doc: DocumentReference) => {
        let id = doc.id;
        updateDoc(doc, { id: id });
      }
    );
    let message = '"' + this.dishForm.controls['name'].value + '" added.';
    this._snackBar.open(message, undefined, { duration: 5000 });
    this.dishForm.reset();
    this.dishForm.markAsUntouched();
  }

  filterTags() {
    this.tagList = this.tagListSave.slice();
    if (this.filterService.inputValue(this.search).length != 0) {
      this.tagList = this.filtered();
    }
  }

  filtered() {
    return this.tagList.filter((item) =>
      this.filterService.isPartOfString(
        item,
        this.filterService.inputValue(this.search)
      )
    );
  }
}
