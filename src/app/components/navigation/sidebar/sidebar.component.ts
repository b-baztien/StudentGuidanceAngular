import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/admin/list-university', title: 'มหาวิทยาลัย', icon: 'school', class: '' },
  { path: '/admin/list-user', title: 'รายการผู้ใช้', icon: 'person', class: '' },
  { path: '/login', title: 'ออกจากระบบ', icon: 'exit_to_app', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
