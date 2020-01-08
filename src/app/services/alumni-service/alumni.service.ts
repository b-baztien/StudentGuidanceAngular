import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
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
    return this.firestore.collection(school.parent).doc(school.id)
      .collection('Alumni')
      .snapshotChanges().pipe(map(result => result.map(item => item.payload.doc)));
  }
}
