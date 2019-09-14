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

  addUniversity(university: University) {
    let addResult: Boolean = false;
    const universityJSON = JSON.stringify(university);
    this.firestore.collection('University').doc(university.university_name).set(JSON.parse(universityJSON)).then(() => { addResult = true }).catch(e => e);
    return addResult;
  }

  getAllUniversity() {
    return this.firestore.collection('University').snapshotChanges();
  }

  getUniversity(university_id: string) {
    return this.firestore.collection('University').doc(university_id).snapshotChanges();
  }
}
