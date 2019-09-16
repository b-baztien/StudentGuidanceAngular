declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
  }

  export const ADMINROUTES: RouteInfo[] = [
    { path: '/admin/list-university', title: 'มหาวิทยาลัย', icon: 'school', class: '' },
    { path: '/admin/list-user', title: 'รายการผู้ใช้', icon: 'person', class: '' },
    { path: '/login', title: 'ออกจากระบบ', icon: 'exit_to_app', class: 'active-pro' },
  ];