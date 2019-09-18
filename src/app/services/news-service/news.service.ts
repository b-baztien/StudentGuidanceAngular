import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private firestore: AngularFirestore) {
  }

  getAllNews() {
    this.firestore.collection('News').snapshotChanges();
  }
}
