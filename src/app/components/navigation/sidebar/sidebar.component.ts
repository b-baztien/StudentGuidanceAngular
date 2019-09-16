import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ADMINROUTES, TEACHERROUTES } from '../../util/routeinfo';

declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  location: Location;
  ROUTES;

  constructor(location: Location) {
    this.location = location;
  }

  ngOnInit() {
    this.ROUTES = this.location.path().includes('admin') ? ADMINROUTES : TEACHERROUTES;
    this.menuItems = this.ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
