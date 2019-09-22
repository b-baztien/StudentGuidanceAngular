import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { University } from 'src/app/model/University';
import { exists } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  constructor(private firestore: AngularFirestore) {
  }

  addFaculty(university: University, faculty: Faculty) {
    this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).get().subscribe(result => {
        if (!result.exists) {
          return this.firestore.collection('University').doc(university.university_name)
            .collection('Faculty').doc(faculty.faculty_name).set(Object.assign({}, faculty));
        } else {
          throw new Error('มีคณะนี้อยู่ในระบบแล้ว');
        }
      });
  }

  updateFaculty(university: University, faculty: Faculty) {
    return this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).set(Object.assign({}, faculty));
  }

  getAllFaculty(university_name: string) {
    return this.firestore.collection('University').doc(university_name)
      .collection('Faculty').snapshotChanges();
  }

  deleteFaculty(university: University, faculty: Faculty) {
    return this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).delete();
  }
}
