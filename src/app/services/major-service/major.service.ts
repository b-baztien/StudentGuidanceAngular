import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { Major } from 'src/app/model/Major';
import { Subject } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';
import { Career } from 'src/app/model/Career';
import { EntranceExamResultService } from '../entrance-exam-result-service/entrance-exam-result.service';
import { map } from 'rxjs/operators';
import { CareerService } from '../career-service/career.service';

@Injectable({
  providedIn: 'root'
})
export class MajorService {

  constructor(
    private firestore: AngularFirestore,
    private entranceExamResultService: EntranceExamResultService,
    private careerService: CareerService,
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
      .collection('Major', query => query.orderBy('majorName')).snapshotChanges()
      .pipe(map(docs => docs.map(item => item.payload.doc)));
  }

  async addMajor(facultyRef: DocumentReference, major: Major) {
    try {
      await this.firestore.collection(facultyRef.parent).doc(facultyRef.id)
        .collection('Major', query => query.where('majorName', '==', major.majorName)).get()
        .toPromise().then(async result => {
          if (!result.empty) throw new Error('มีสาขานี้อยู่ในระบบแล้ว');
          await this.firestore.collection(facultyRef.parent).doc(facultyRef.id)
            .collection('Major').add(Object.assign({}, major));
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

  async updateMajor(majorRef: DocumentReference, major: Major) {
    try {
      this.careerService.addAllCareer(major.listCareerName.map(career_name => {
        let career = new Career();
        career.career_name = career_name;
        return career;
      }));
      return await this.firestore.collection(majorRef.parent).doc(majorRef.id).update(Object.assign({}, major));
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
