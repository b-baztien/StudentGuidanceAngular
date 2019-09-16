import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { University } from 'src/app/model/University';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  constructor(private firestore: AngularFirestore) {
  }

  addEditFaculty(university: University, faculty: Faculty) {
    return this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).set(JSON.parse(JSON.stringify(faculty)));
  }

  getAllFaculty(university_name: string) {
    return this.firestore.collection('University').doc(university_name)
      .collection('Faculty').snapshotChanges();
  }
}
