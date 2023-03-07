import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() name;
  @Input() playerActive:boolean = false;

  constructor() {}

  ngOnInit(): void {
    
  }


}
