import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, QueryDocumentSnapshot, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Career } from 'src/app/model/Career';
import { AngularFireStorage } from '@angular/fire/storage';
import { Major } from 'src/app/model/Major';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) {
  }

  getAllCareer() {
    return this.firestore.collectionGroup('Career', query => query.orderBy('career_name'))
      .snapshotChanges().pipe(map(result => result.map(item => item.payload.doc)));
  }

  getCareer(careerId: string) {
    return this.firestore.collection('Career').doc(careerId).snapshotChanges();
  }

  getAllCareerByMajorReference(majorRef: DocumentReference) {
    return this.firestore.collection(majorRef.parent).doc(majorRef.id)
      .collection('Career', query => query.orderBy('career_name')).snapshotChanges()
      .pipe(map(result => result.map(item => item.payload.doc)));
  }

  async addAllCareer(listCareer: Career[]) {
    try {
      let listCareerRef = new Array<DocumentReference>();
      listCareer.forEach(async (career) => {
        listCareerRef.push(await this.firestore.collection('Career').doc(career.career_name).get().toPromise().then(result => {
          if (result.exists) return result.ref;
          return this.firestore.collection('Career').doc(career.career_name).set(Object.assign({}, career))
            .then(() => this.firestore.collection('Career').doc(career.career_name).ref);
        }));
      });
      return listCareerRef;
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  updateCareer(career: Career) {
    try {
      this.firestore.collection('Career').doc(career.career_name).set(Object.assign({}, career));
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  deleteCareer(careerRef: QueryDocumentSnapshot<unknown>) {
    // try {
    //   const career = careerRef.data() as Career;
    //   if (career.image !== undefined) {
    //     this.afStorage.storage.ref(career.image).delete();
    //   }
    //   this.firestore.collection('Major').ref.where('career', 'array-contains', careerRef.ref).onSnapshot(result => {
    //     result.forEach(docsRs => {
    //       const major = docsRs.data() as Major;
    //       for (let i = 0; i < major.career.length; i++) {
    //         if (major.career[i].id == careerRef.id) {
    //           major.career.splice(i, 1);
    //           this.firestore.collection('Major').doc(docsRs.id).set(Object.assign({}, major));
    //         }
    //       }
    //     });
    //     this.firestore.collection('Career').doc(career.career_name).delete();
    //   });
    // } catch (error) {
    //   console.error(error);
    //   throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    // }
  }

  async deleteMajorInCareer(major: DocumentReference) {
    // return await this.firestore.collection('Career').ref.where('major', '==', major).get().then(async result => {
    //   if (!result.empty) {
    //     result.docs.forEach(careerRef => {
    //       let career = careerRef.data() as Career;
    //       for (let i = 0; i < career.major.length; i++) {
    //         if (career.major[i].id == major.id) {
    //           career.major.splice(i, 1);
    //           this.firestore.collection('Career').doc(careerRef.id).update(Object.assign({}, career));
    //         }
    //       }
    //     });
    //   }
    // });
  }
}
