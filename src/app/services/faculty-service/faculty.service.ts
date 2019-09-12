import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  constructor(private firestore: AngularFirestore) {
  }

  addFaculty(faculty: Faculty) {
    let result: Boolean = false;
    this.firestore.collection('Faculty').ref.where('faculty_name', '==', faculty.faculty_name)
      .where('university', '==', faculty.university).get().then(snapshot => {
        if (!snapshot.empty) {
          this.firestore.collection('Faculty').add(faculty);
          result = true;
        } else {
          throw Error(`มีข้อมูลคณะ ${faculty.faculty_name} อยู่แล้ว`);
        }
      }).catch(error => {
        throw error;
      });
    return result;
  }
}
