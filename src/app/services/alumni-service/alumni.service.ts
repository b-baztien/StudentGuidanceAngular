import { Injectable, Query } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { Student } from 'src/app/model/Student';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';

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
