import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {

  player: FormGroup;
  profiles: string[] = [
    'profile_men_1.png',
    'profile_men_2.png',
    'profile_woman_1.png',
    'profile_woman_2.png'    
  ];

  name: string;
  profile: string;

  constructor(private dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}

  ngOnInit(): void {
    this.player = new FormGroup({
      name: new FormControl('', Validators.required),
      profile: new FormControl('', Validators.required)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  

}
