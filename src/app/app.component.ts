import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
constructor(private router: Router) {}
  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('userData'))
    if(userData === null || userData === undefined){
      this.router.navigateByUrl('/login');
    }
  }
}
