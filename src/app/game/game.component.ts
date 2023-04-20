import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  games$: Observable<any[]>;
  coll: any;

  constructor(
    public firestore: Firestore,
    public dialog: MatDialog,   
    private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.coll = collection(this.firestore, 'games');
    this.games$ = collectionData(this.coll);
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.games$.subscribe(() => {
        this.grabCorrectDocument();
      })
    })  
  }



  newGame() {
    this.game = new Game();
  }  


  async grabCorrectDocument() {
    let docRef = doc(this.firestore,"games",this.gameId);
    let docSnap = await getDoc(docRef);
    let data = await docSnap.data();
    this.updateData(data);
  }

  updateData(data) {
    this.game.players = data['players'];    
    this.game.stack = data['stack'];
    this.game.playedCards = data['playedCards'];
    this.game.currentPlayer = data['currentPlayer'];    
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
