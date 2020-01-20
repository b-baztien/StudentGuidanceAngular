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
    return this.firestore.collection('School').snapshotChanges()
      .pipe(map(result => result.map(item => {
        const doc = item.payload.doc;
        return { id: doc.id, ref: doc.ref, ...doc.data() as School } as School;
      })));
  }

  getSchool(schoolId: string) {
    return this.firestore.collection('School').doc(schoolId).snapshotChanges()
      .pipe(map(result => {
        return { id: result.payload.id, ref: result.payload.ref, ...result.payload.data() as School };
      }));
  }

  getSchoolByUser(username: string) {
    // return this.firestore.collection('Login')
    //   .doc(username).collection('School').snapshotChanges().pipe(map(result => result[0].payload.doc));
  }

  async addSchool(school: School) {
    // return await this.firestore.collection('School').doc(school.school_name).ref.get().then(async schoolRes => {
    //   if (!schoolRes.exists) {
    //     return await this.firestore.collection('School').doc(school.school_name).set(Object.assign({}, school)).then(() => {
    //       return this.firestore.collection('School').doc(school.school_name).ref;
    //     });
    //   } else {
    //     return schoolRes.ref;
    //   }
    // });
  }
}