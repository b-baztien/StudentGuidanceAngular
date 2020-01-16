import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Student } from 'src/app/model/Student';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlumniService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  getAlumniBySchoolReference(school: DocumentReference) {
    return this.firestore.collectionGroup('School', query => query.where('school_name', '==', school.id)
      .orderBy('firstname')).snapshotChanges().pipe(
        map(result => result.filter(item => (item.payload.doc.data() as Student).student_status !== 'กำลังศึกษา')
          .map(item => item.payload.doc)));
  }
}
