import { AfterViewInit, Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements AfterViewInit {
  private breakpointObserver = inject(BreakpointObserver);
  dataService: FirestoreDataService = inject(FirestoreDataService);
  tags: string[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  lotsOfTabs = new Array(30).fill(0).map((_, index) => `Tab ${index}`);

  ngAfterViewInit(): void {
    this.dataService.tagColl$.subscribe((data) => {
      data.forEach((item: { tag: string }) => {
        this.tags.push(item.tag);
      });
    });
  }
}
