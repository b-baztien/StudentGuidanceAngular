import { Location } from "@angular/common";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ADMINROUTES: RouteInfo[] = [
  {
    path: "/admin/list-university",
    title: "มหาวิทยาลัย",
    icon: "school",
    class: ""
  },
  {
    path: "/admin/list-career",
    title: "รายการอาชีพ",
    icon: "build",
    class: ""
  },
  {
    path: "/admin/list-user",
    title: "รายการผู้ใช้",
    icon: "person",
    class: ""
  },
  {
    path: "/admin/edit-password",
    title: "แก้ไขรหัสผ่าน",
    icon: "edit",
    class: ""
  },
  {
    path: "/logout",
    title: "ออกจากระบบ",
    icon: "exit_to_app",
    class: "active-pro"
  }
];

export const TEACHERROUTES: RouteInfo[] = [
  {
    path: "/teacher/list-entrance-exam-result",
    title: "ข้อมูลการสอบติด",
    icon: "account_box",
    class: ""
  },
  {
    path: "/teacher/list-student",
    title: "รายชื่อนักเรียนในโรงเรียน",
    icon: "person",
    class: ""
  },
  {
    path: "/teacher/list-news",
    title: "ข่าวสาร",
    icon: "library_books",
    class: ""
  },
  {
    path: "/teacher/list-university",
    title: "รายชื่อมหาวิทยาลัย",
    icon: "school",
    class: ""
  },
  {
    path: "/teacher/profile",
    title: "แก้ไขข้อมูลส่วนตัว",
    icon: "account_box",
    class: ""
  },
  {
    path: "/teacher/edit-password",
    title: "เปลี่ยนรหัสผ่าน",
    icon: "vpn_key",
    class: ""
  },
  {
    path: "/logout",
    title: "ออกจากระบบ",
    icon: "exit_to_app",
    class: "active-pro"
  }
];
