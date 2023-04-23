import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, collectionData, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { DialogEditPlayerComponent } from '../dialog-edit-player/dialog-edit-player.component';
import { DialogEndOfGameComponent } from '../dialog-end-of-game/dialog-end-of-game.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {  
  game: Game;
  gameId: string;  
  games$: Observable<any[]>;
  coll: any;

  constructor(
    public firestore: Firestore,
    public dialog: MatDialog,   
    public router: Router,
    private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.coll = collection(this.firestore, 'games');
    this.games$ = collectionData(this.coll);
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      console.log(this.gameId);      
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
    console.log(docRef);    
    let docSnap = await getDoc(docRef);
    let data = await docSnap.data();
    this.updateData(data);
  }

  updateData(data) {
    this.game.players = data['players'];    
    this.game.stack = data['stack'];
    this.game.playedCards = data['playedCards'];
    this.game.currentPlayer = data['currentPlayer'];   
    this.game.pickCardAnimation = data['pickCardAnimation'];
    this.game.currentCard = data['currentCard']; 
  }

  saveGame() {
    let docRef = doc(this.firestore,"games",this.gameId);
    updateDoc(docRef, this.game.toJson());
  }
  

  takeCard() {
    if (this.game.players.length == 0) {
      alert('Bitte Spieler hinzufügen!');
      return;
    } if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      console.log(this.game.currentCard);
      this.game.pickCardAnimation = true;
      console.log('New card:' + this.game.currentCard);
      console.log('Game is', this.game);     
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
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
        this.saveGame();
      }     
    });
  }


  openDialogEditPlayer(i: number){
    const dialogRef = this.dialog.open(DialogEditPlayerComponent, {
      data: {
        playerName: this.game.players[i]['name'],
        playerProfile: this.game.players[i]['profile']
      }
    });

    dialogRef.afterClosed().subscribe((player: any) => {
      if(player){
        this.game.players[i]['name'] = player.name;
        this.game.players[i]['profile'] = player.profile;
      } if(player == 'remove'){
        this.game.players.splice(i , 1);
      }
      this.saveGame();
    });
  }


  openDialogEnd(){
    const dialogRef = this.dialog.open(DialogEndOfGameComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        this.router.navigateByUrl('');
      }
      else{
        for(let i= 1; i < 14; i++){
          this.game.stack.push('spade_' + i);
          this.game.stack.push('clubs_' + i);
          this.game.stack.push('diamonds_' + i);
          this.game.stack.push('hearts_' + i);
      }

      this.shuffle(this.game.stack);
      this.saveGame();
      }
    });
  }


  shuffle(array:any) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

}





