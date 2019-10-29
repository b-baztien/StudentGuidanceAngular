import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { Major } from 'src/app/model/Major';
import { Subject } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';
import { Carrer } from 'src/app/model/Carrer';
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

  getMajorByFacultyId(facultyId: string) {
    let osbMajor = new Subject<Array<QueryDocumentSnapshot<unknown>>>();
    this.firestore.collection('Major').snapshotChanges().subscribe(mjDoc => {
      let listMajor = new Array<QueryDocumentSnapshot<unknown>>();
      mjDoc.forEach(mj => {
        let major = mj.payload.doc;
        let dupMajor = false;
        if ((major.data() as Major).faculty.id == facultyId) {
          for (let i = 0; i < listMajor.length; i++) {
            if (listMajor[i].id == major.id) {
              dupMajor = true;
              listMajor.splice(i, 1, major);
            }
          }
          if (!dupMajor) {
            listMajor.push(major);
          }
        }
        osbMajor.next(listMajor);
      });
    });
    return osbMajor.asObservable();
  }

  async addMajor(facultyId: string, major: Major) {
    try {
      return await this.firestore.collection('Major').doc(major.major_name + facultyId).ref.get().then(async result => {
        major.faculty = await this.firestore.collection('Faculty').doc(facultyId).ref;
        if (!result.exists) {
          return await this.firestore.collection('Major').doc(major.major_name + facultyId).set(Object.assign({}, major))
            .then(async () => {
              return await major.faculty.get().then(facultyRef => {
                const faculty = facultyRef.data() as Faculty;
                faculty.major = faculty.major === undefined ? new Array<DocumentReference>() : faculty.major;
                faculty.major.push(this.firestore.collection('Major').doc(major.major_name + facultyId).ref);
                this.firestore.collection('Faculty').doc(facultyId).set(Object.assign({}, faculty));
                return this.firestore.collection('Major').doc(major.major_name + facultyId).ref
              });
            });
        } else {
          throw new Error('มีสาขานี้อยู่ในระบบแล้ว');
        }
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
      this.firestore.collection('Carrer').ref.where('major', 'array-contains', major.ref).onSnapshot(result => {
        result.forEach(docsRs => {
          const carrer = docsRs.data() as Carrer;
          for (let i = 0; i < carrer.major.length; i++) {
            if (carrer.major[i].id == major.id) {
              carrer.major.splice(i, 1);
              this.firestore.collection('Carrer').doc(docsRs.id).set(Object.assign({}, carrer));
            }
          }
        })
      });
      this.firestore.collection('Faculty').ref.where('major', 'array-contains', major.ref).onSnapshot(result => {
        result.forEach(docsRs => {
          const faculty = docsRs.data() as Faculty;
          for (let i = 0; i < faculty.major.length; i++) {
            if (faculty.major[i].id == major.id) {
              faculty.major.splice(i, 1);
              this.firestore.collection('Faculty').doc(docsRs.id).set(Object.assign({}, faculty));
            }
          }
          this.firestore.collection('Major').doc(major.id).delete();
        });
      });
    } catch (error) {
      console.log(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }
}
