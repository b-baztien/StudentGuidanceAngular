import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Faculty } from 'src/app/model/Faculty';
import { Major } from 'src/app/model/Major';
import { FacultyService } from '../faculty-service/faculty.service';
import { Subject } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MajorService {

  constructor(
    private firestore: AngularFirestore,
    private facultyService: FacultyService,
  ) {
  }

  getAllMajor() {
    return this.firestore.collection('Major').snapshotChanges;
  }

  getMajorByFacultyId(facultyId: string) {
    let osbMajor = new Subject<Array<QueryDocumentSnapshot<unknown>>>();
    let listMajor = new Array<QueryDocumentSnapshot<unknown>>();
    this.firestore.collection('Major').snapshotChanges().subscribe(mjDoc => {
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
    major.faculty = this.firestore.collection('Faculty').doc(facultyId).ref;
    return await this.firestore.collection('Major').doc(major.major_name + facultyId).ref.get().then(async result => {
      if (!result.exists) {
        return await this.firestore.collection('Major').doc(major.major_name + facultyId).set(Object.assign({}, major)).then(
          async () => {
            return await major.faculty.get().then(facultyRef => {
              const faculty = facultyRef.data() as Faculty;
              console.log(faculty);
              faculty.major = faculty.major === undefined ? new Array<DocumentReference>() : faculty.major;
              faculty.major.push(this.firestore.collection('Faculty').doc(major.major_name + facultyId).ref);
              this.facultyService.updateFaculty(facultyId, faculty);

              return this.firestore.collection('Faculty').doc(major.major_name + facultyId).ref
            });
          });
      } else {
        throw new Error('มีสาขานี้อยู่ในระบบแล้ว');
      }
    });
  }
}
