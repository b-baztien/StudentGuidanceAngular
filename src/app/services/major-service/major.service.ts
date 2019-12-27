import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { Major } from 'src/app/model/Major';
import { Subject } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';
import { Career } from 'src/app/model/Career';
import { EntranceExamResultService } from '../entrance-exam-result-service/entrance-exam-result.service';

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

  getMajorById(majorId: string) {
    return this.firestore.collection('Major').doc(majorId).snapshotChanges();
  }

  getMajorByFacultyReference(facultyRef: DocumentReference) {
    return this.firestore.collection(facultyRef.parent.path).doc(facultyRef.id).collection('Major').snapshotChanges();
  }

  async addMajor(facultyId: string, major: Major) {
    try {
      return await this.firestore.collection('Major').doc(major.major_name + facultyId).ref.get().then(async result => {
        // major.faculty = this.firestore.collection('Faculty').doc(facultyId).ref;
        // if (!result.exists) {
        //   return await this.firestore.collection('Major').doc(major.major_name + facultyId).set(Object.assign({}, major))
        //     .then(async () => {
        //       return await major.faculty.get().then(facultyRef => {
        //         const faculty = facultyRef.data() as Faculty;
        //         faculty.major = faculty.major === undefined ? new Array<DocumentReference>() : faculty.major;
        //         faculty.major.push(this.firestore.collection('Major').doc(major.major_name + facultyId).ref);
        //         this.firestore.collection('Faculty').doc(facultyId).set(Object.assign({}, faculty));
        //         return this.firestore.collection('Major').doc(major.major_name + facultyId).ref
        //       });
        //     });
        // } else {
        //   throw new Error('มีสาขานี้อยู่ในระบบแล้ว');
        // }
      });
    } catch (error) {
      console.log(error);
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

  deleteMajor(major: QueryDocumentSnapshot<unknown>) {
    try {
      this.entranceExamResultService.deleteMajorInExamResult(major.ref);
      this.firestore.collection('Career').ref.where('major', 'array-contains', major.ref).onSnapshot(result => {
        result.forEach(docsRs => {
          const career = docsRs.data() as Career;
          for (let i = 0; i < career.major.length; i++) {
            if (career.major[i].id == major.id) {
              career.major.splice(i, 1);
              this.firestore.collection('Career').doc(docsRs.id).set(Object.assign({}, career));
            }
          }
        })
      });
      this.firestore.collection('Faculty').ref.where('major', 'array-contains', major.ref).onSnapshot(result => {
        result.forEach(docsRs => {
          const faculty = docsRs.data() as Faculty;
          // for (let i = 0; i < faculty.major.length; i++) {
          //   if (faculty.major[i].id == major.id) {
          //     faculty.major.splice(i, 1);
          //     this.firestore.collection('Faculty').doc(docsRs.id).set(Object.assign({}, faculty));
          //   }
          // }
          this.firestore.collection('Major').doc(major.id).delete();
        });
      });
    } catch (error) {
      console.log(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }
}
