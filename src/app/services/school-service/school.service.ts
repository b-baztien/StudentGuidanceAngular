import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { School } from 'src/app/model/School';
import { map } from 'rxjs/operators';

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
    return this.firestore.collection('School').doc(schoolId).snapshotChanges().pipe(map(result => result.payload));
  }

  getSchoolByCondition(schoolId: string, queryFn) {
    return this.firestore.collection('School', queryFn).doc(schoolId).snapshotChanges();
  }

  async addSchool(school: School) {
    return await this.firestore.collection('School').doc(school.school_name).ref.get().then(async schoolRes => {
      if (!schoolRes.exists) {
        return await this.firestore.collection('School').doc(school.school_name).set(Object.assign({}, school)).then(() => {
          return this.firestore.collection('School').doc(school.school_name).ref;
        });
      } else {
        return schoolRes.ref;
      }
    });
  }
}