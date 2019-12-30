import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  QueryDocumentSnapshot,
  FieldPath,
  DocumentReference
} from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { University } from 'src/app/model/University';
import { UniversityService } from '../university-service/university.service';
import { Observable } from 'rxjs';
import { MajorService } from '../major-service/major.service';
import { map } from 'rxjs/operators';

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

  async updateFaculty(facultyRef: DocumentReference, faculty: Faculty) {
    try {
      await this.firestore.collection(facultyRef.parent).doc(facultyRef.id).update(Object.assign({}, faculty));
    } catch (error) {
      console.error(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }

  getAllFaculty() {
    return this.firestore.collection('Faculty', query => query.orderBy('faculty_name')).snapshotChanges();
  }

  getFacultyByUniversityId(universityId: string) {
    return this.firestore.collection('University', query => query.orderBy('faculty_name'))
      .doc(universityId).collection('Faculty').snapshotChanges()
      .pipe(map(docs => docs.map(result => result.payload.doc)));
  }

  getFacultyByFacultyId(facultyId: string) {
    return this.firestore.collectionGroup(`Faculty/${facultyId}`).snapshotChanges();
  }

  async deleteFaculty(faculty: DocumentReference) {
    try {
      await this.firestore.collection(faculty.parent).doc(faculty.id).delete();
    } catch (error) {
      console.log(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }
}
