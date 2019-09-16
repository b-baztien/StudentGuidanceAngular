import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { University } from 'src/app/model/University';
import { Faculty } from 'src/app/model/Faculty';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  constructor(private firestore: AngularFirestore) {
  }

  ngOnInit() {
  }

  addUniversity(university: University) {
    const universityJSON = JSON.stringify(university);
    return this.firestore.collection('University').doc(university.university_name).set(JSON.parse(universityJSON));
  }

  updateUniversity(university: University, faculty: Faculty) {
    return this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).set(JSON.parse(JSON.stringify(faculty)));
  }

  getAllUniversity() {
    return this.firestore.collection('University').snapshotChanges();
  }

  getUniversity(university_id: string) {
    return this.firestore.collection('University').doc(university_id).snapshotChanges();
  }
}
