import { Injectable } from '@angular/core';
import { University } from 'src/app/model/University';
import { Faculty } from 'src/app/model/Faculty';
import { AngularFirestore } from '@angular/fire/firestore';
import { Major } from 'src/app/model/Major';
import { Teacher } from 'src/app/model/Teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private firestore: AngularFirestore) {
  }

  getAllMajor(university: University, faculty: Faculty) {
    return this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).collection('Major').snapshotChanges;
  }

  addTeacher() {
    let teacher: Teacher = new Teacher();
    teacher.firstname = 'tttt';
    teacher.lastname = 'llll';
    teacher.email = '123@123.com';
    teacher.phone_no = '012345678';
    teacher.school = this.firestore.collection('School').doc('โรงเรียนทดสอบ').ref;

    return this.firestore.collection('Teacher').add(Object.assign({}, teacher));
  }
}
