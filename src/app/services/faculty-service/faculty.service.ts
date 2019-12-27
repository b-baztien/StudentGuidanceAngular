import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  QueryDocumentSnapshot,
  DocumentReference,
  DocumentChangeAction,
  DocumentData,
  QuerySnapshot
} from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { University } from 'src/app/model/University';
import { UniversityService } from '../university-service/university.service';
import { Observable } from 'rxjs';
import { MajorService } from '../major-service/major.service';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  constructor(
    private firestore: AngularFirestore,
    private universityService: UniversityService,
    private majorService: MajorService,
  ) {
  }

  async addFaculty(universityId: string, faculty: Faculty) {
    const firestoreCol = this.firestore.collection('University').doc(universityId).collection('Faculty');
    try {
      if (!(await firestoreCol.ref.where('faculty_name', '==', faculty.faculty_name).get()).empty) {
        throw new Error('มีคณะนี้อยู่ในระบบแล้ว');
      }
      firestoreCol.add(Object.assign({}, faculty));
    } catch (error) {
      console.error(error);
      if (error.message == 'มีคณะนี้อยู่ในระบบแล้ว') {
        throw error;
      } else {
        throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
      }
    }
  }

  updateFaculty(facultyId: string, faculty: Faculty) {
    try {
      return this.firestore.collection('Faculty').doc(facultyId).set(Object.assign({}, faculty));
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  getAllFaculty() {
    return this.firestore.collection('Faculty').snapshotChanges();
  }

  getFacultyByUniversityId(universityId: string) {
    return this.firestore.collection('University').doc(universityId).collection('Faculty').snapshotChanges();
  }

  getFacultyByFacultyId(facultyId: string) {
    return this.firestore.collectionGroup(`Faculty/${facultyId}`).snapshotChanges();
  }

  async deleteFaculty(faculty: QueryDocumentSnapshot<unknown>) {
    try {
      this.firestore.collection('Major').ref.where('faculty', '==', faculty.ref).onSnapshot(result => {
        result.forEach(docsRs => {
          this.majorService.deleteMajor(docsRs);
        });
      })
      this.firestore.collection('University').ref.where('faculty', 'array-contains', faculty.ref).onSnapshot(result => {
        result.forEach(docsRs => {
          const university = docsRs.data() as University;
          // for (let i = 0; i < university.faculty.length; i++) {
          //   if (university.faculty[i].id == faculty.id) {
          //     university.faculty.splice(i, 1);
          //     this.universityService.updateUniversity(docsRs.id, university);
          //   }
          // }
        })
        this.firestore.collection('Faculty').doc(faculty.id).delete();
      })
    } catch (error) {
      console.log(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }
}
