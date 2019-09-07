import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { University } from 'src/app/model/University';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  constructor(private firestore: AngularFirestore) {
  }

  ngOnInit() {
  }

  getAllUniversity() {
    return this.firestore.collection('University').snapshotChanges();
  }

  getUniversity(university_id: string) {
    return this.firestore.collection('University').doc(university_id).snapshotChanges();
  }
}
