import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  constructor(private firestore: AngularFirestore) {
  }

  ngOnInit() {
  }

  getAllUniversity(): Observable<DocumentChangeAction<Object>[]> {
    return this.firestore.collection('University').snapshotChanges();
  }
}
