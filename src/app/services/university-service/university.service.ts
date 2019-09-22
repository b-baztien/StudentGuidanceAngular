import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { University } from 'src/app/model/University';
import { Faculty } from 'src/app/model/Faculty';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  constructor(private firestore: AngularFirestore) {
  }

  ngOnInit() {
  }

  addUniversity(university: University): Boolean {
    let addResult: Boolean = false;
    this.firestore.collection('University').doc(university.university_name).get().subscribe(result => {
      if (!result.exists) {
        this.firestore.collection('University').doc(university.university_name).set(Object.assign({}, university)).then(() => {
          addResult = true;
        }).catch((e) => {
          throw e;
        });
      }
    })
    return addResult;
  }

  updateUniversity(university: University, faculty: Faculty) {
    return this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).set(Object.assign({}, faculty));
  }

  getAllUniversity() {
    return this.firestore.collection('University').snapshotChanges();
  }

  getUniversity(university_id: string) {
    return this.firestore.collection('University').doc(university_id).snapshotChanges();
  }
}
