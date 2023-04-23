import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-player',
  templateUrl: './dialog-edit-player.component.html',
  styleUrls: ['./dialog-edit-player.component.scss']
})
export class DialogEditPlayerComponent {
  player: FormGroup;

  profiles: string[] = [
    'profile_men_1.png',
    'profile_men_2.png',
    'profile_woman_1.png',
    'profile_woman_2.png'    
  ];

  name: string;
  profile: string;

  constructor(public dialogRef: MatDialogRef<DialogEditPlayerComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {playerName: string, playerProfile: string}) {
  }

  ngOnInit(): void {
    this.player = new FormGroup({
      name: new FormControl(this.data.playerName , Validators.required),
      profile: new FormControl(this.data.playerProfile, Validators.required)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
