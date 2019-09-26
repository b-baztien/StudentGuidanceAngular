import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {

  transform(type: string): any {
    switch (type) {
      case 'admin': return 'ผู้ดูแล';
      case 'teacher': return 'ครู';
      case 'student': return 'นักเรียน';
      case 'alumni': return 'ศิษย์เก่า';
      default: return 'ไม่ทราบ';
    }
  }

}
