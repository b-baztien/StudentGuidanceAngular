import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  constructor(private firestore: AngularFirestore) {
  }

  getAllSchool() {
    return this.firestore.collection('School').snapshotChanges();
  }

  getSchool(schoolId: string) {
    return this.firestore.collection('School').doc(schoolId).snapshotChanges();
  }
}