import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { addDoc, collection } from '@firebase/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  
  constructor(public firestore: Firestore, private router: Router) { }

  ngOnInit(): void {
    
  }

  newGame() {
    let game = new Game();
    let coll = collection(this.firestore, 'games');
    addDoc(coll, game.toJson())
    .then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
      
      
    });
  }

}
