import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { University } from 'src/app/model/University';
import { Faculty } from 'src/app/model/Faculty';
import { Major } from 'src/app/model/Major';

@Injectable({
  providedIn: 'root'
})
export class MajorService {

  constructor(private firestore: AngularFirestore) {
  }

  getAllMajor() {
    return this.firestore.collection('Major').snapshotChanges();
  }

  getMajor(university: University, faculty: Faculty) {
    return this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).collection('Major').snapshotChanges;
  }

  addMajor(university: University, faculty: Faculty, major: Major) {
    this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).collection('Major').doc(major.major_name)
      .get().subscribe(result => {
        if (!result.exists) {
          return this.firestore.collection('University').doc(university.university_name)
            .collection('Faculty').doc(faculty.faculty_name).collection('Major').doc(major.major_name).set(JSON.parse(JSON.stringify(major)));
        } else {
          throw new Error('มีสาขานี้อยู่ในระบบแล้ว');
        }
      });

  }
}
