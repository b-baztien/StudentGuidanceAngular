import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { University } from 'src/app/model/University';
import { UniversityService } from '../university-service/university.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  constructor(private firestore: AngularFirestore, private universityService: UniversityService) {
  }

  addFaculty(universityId: string, faculty: Faculty) {
    faculty.university = this.firestore.collection('University').doc(universityId).ref;
    this.firestore.collection('Faculty').doc(faculty.faculty_name + universityId).get().subscribe(result => {
      if (!result.exists) {
        this.firestore.collection('Faculty').doc(faculty.faculty_name + universityId).set(Object.assign({}, faculty))
          .then(() => {
            faculty.university.get().then(universityRef => {
              const university = universityRef.data() as University;
              university.faculty = university.faculty === undefined ? new Array<DocumentReference>() : university.faculty;
              university.faculty.push(this.firestore.collection('Faculty').doc(faculty.faculty_name + universityId).ref);
              this.universityService.updateUniversity(universityId, university);
            })
          });
      } else {
        throw new Error('มีคณะนี้อยู่ในระบบแล้ว');
      }
    });
  }

  updateFaculty(universityId: string, faculty: Faculty) {
    return this.firestore.collection('Faculty').doc(universityId).set(Object.assign({}, faculty));
  }


  getAllFaculty() {
    return this.firestore.collection('Faculty').snapshotChanges();
  }

  getFacultyByUniversityId(universityId: string) {
    let osbFaculty = new Subject<Array<QueryDocumentSnapshot<unknown>>>();
    let listFaculty = new Array<QueryDocumentSnapshot<unknown>>();
    this.firestore.collection('Faculty').snapshotChanges().subscribe(fctDoc => {
      fctDoc.forEach(fct => {
        let faculty = fct.payload.doc;
        let dupFac = false;
        if ((faculty.data() as Faculty).university.id == universityId) {
          for (let i = 0; i < listFaculty.length; i++) {
            if (listFaculty[i].id == faculty.id) {
              dupFac = true;
              listFaculty.splice(i, 1, faculty);
            }
          }
          if (!dupFac) {
            listFaculty.push(faculty);
          }
        }
        osbFaculty.next(listFaculty);
      });
    });
    return osbFaculty.asObservable();
  }

  getFacultyByFacultyId(facultyId: string) {
    return this.firestore.collection('Faculty').doc(facultyId).snapshotChanges();
  }

  deleteFaculty(faculty: QueryDocumentSnapshot<unknown>) {
    try {
      this.firestore.collection('University').ref.where('faculty', 'array-contains', faculty.ref).onSnapshot(result => {
        result.forEach(docsRs => {
          const university = docsRs.data() as University;
          for (let i = 0; i < university.faculty.length; i++) {
            if (university.faculty[i].id == faculty.id) {
              university.faculty.splice(i, 1);
              this.universityService.updateUniversity(docsRs.id, university);
              this.firestore.collection('Faculty').doc(faculty.id).delete();
            }
          }
        })
      })
    } catch (error) {
      console.log(error);
      throw new Error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง');
    }
  }
}
