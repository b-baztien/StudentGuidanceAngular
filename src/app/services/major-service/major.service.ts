import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { Major } from 'src/app/model/Major';
import { Subject } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';
import { Career } from 'src/app/model/Career';
import { EntranceExamResultService } from '../entrance-exam-result-service/entrance-exam-result.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MajorService {

  constructor(
    private firestore: AngularFirestore,
    private entranceExamResultService: EntranceExamResultService,
  ) {
  }

  getAllMajor() {
    return this.firestore.collection('Major').snapshotChanges();
  }

  getMajorByReference(majorRef: DocumentReference) {
    return this.firestore.collection(majorRef.parent).doc(majorRef.id).snapshotChanges()
      .pipe(map(result => result.payload));
  }

  getMajorByFacultyReference(facultyRef: DocumentReference) {
    return this.firestore.collection(facultyRef.parent.path).doc(facultyRef.id)
      .collection('Major', query => query.orderBy('major_name')).snapshotChanges()
      .pipe(map(docs => docs.map(item => item.payload.doc)));
  }

  async addMajor(facultyRef: DocumentReference, major: Major, listCareer: Career[]) {
    try {
      await this.firestore.collection(facultyRef.parent).doc(facultyRef.id)
        .collection('Major', query => query.where('major_name', '==', major.major_name)).get()
        .toPromise().then(async result => {
          if (result.size > 0) throw new Error('มีสาขานี้อยู่ในระบบแล้ว');
          await this.firestore.collection(facultyRef.parent).doc(facultyRef.id)
            .collection('Major').add(Object.assign({}, major)).then(majorRef => {
              listCareer.forEach(async career => {
                await majorRef.collection('Career').add(Object.assign({}, career));
              });
            });
        });
    } catch (error) {
      console.error(error);
      if (error.message == 'มีสาขานี้อยู่ในระบบแล้ว') {
        throw error;
      } else {
        throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
      }
    }
  }

  updateMajor(majorId: string, major: Major) {
    try {
      return this.firestore.collection('Major').doc(majorId).set(Object.assign({}, major));
    } catch (error) {
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  async deleteMajor(major: DocumentReference) {
    try {
      await this.firestore.collection(major.parent).doc(major.id).delete();
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }
}
