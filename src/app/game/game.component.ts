import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { doc } from '@angular/fire/firestore';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  gameId: string;
  firestore: Firestore = inject(Firestore);
  games$: Observable<any[]>;

  constructor(    
    public dialog: MatDialog,
    private route: ActivatedRoute) 
    {
    const aCollection = collection(this.firestore, 'games')
    this.games$ = collectionData(aCollection);
  }

  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe(params => {
      const gameId = params['id'];
      console.log('Game ID:', gameId);
      const gameRef = doc(this.firestore, 'games', gameId);
      console.log('Game Ref:', gameRef);
      console.log('Game ID:', gameRef.id);

      this.games$.subscribe((firestore) => {
        console.log(firestore);
      })

    });
  }

  newGame() {
    this.game = new Game();
    const coll = collection(this.firestore, 'games');
    let gameInfo = addDoc(coll, { game: this.game.toJson() });
    console.log('Game info', gameInfo);

  }

  takeCard() {
    if (this.game.players.length == 0) {
      alert('Bitte Spieler hinzufügen!');
      return;
    } if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard);
      this.pickCardAnimation = true;
      console.log('New card:' + this.currentCard);
      console.log('Game is', this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1250);
    }
  }


  openDialog(): void {
    if (this.game.players.length > 3) {
      alert('Maximal 4 Spieler können gleichzeitig spielen!');
      return;
    } const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }



}
