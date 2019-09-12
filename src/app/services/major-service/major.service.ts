import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MajorService {

  constructor(private firestore: AngularFirestore) {
  }

  getMajor(path: string) {
    return this.firestore.collection('Major').snapshotChanges();
  }
}
