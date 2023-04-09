import { Component, inject  } from '@angular/core';
import { Firestore, collection, collectionData  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ring-of-fire';
  firestore: Firestore = inject(Firestore);
  games$: Observable<any[]>;


  constructor() {
    const aCollection = collection(this.firestore, 'games')
    this.games$ = collectionData(aCollection);
  }
}
