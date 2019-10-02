import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { FacultyService } from '../faculty-service/faculty.service';
import { University } from 'src/app/model/University';
import { Faculty } from 'src/app/model/Faculty';
import { Subject } from 'rxjs';
import { Major } from 'src/app/model/Major';

@Injectable({
  providedIn: 'root'
})
export class CarrerService {
  constructor(
    private firestore: AngularFirestore,
    private facultyService: FacultyService,
  ) {
  }

  getAllCarrer() {
    return this.firestore.collection('Carrer').snapshotChanges();
  }

  addCarrer(facultyId: string, major: Major) {
    console.log(facultyId);
    console.log(major);
    major.faculty = this.firestore.collection('Faculty').doc(facultyId).ref;
    this.firestore.collection('Major').doc(major.major_name + facultyId).get().subscribe(result => {
      if (!result.exists) {
        this.firestore.collection('Major').doc(major.major_name + facultyId).set(Object.assign({}, major)).then(
          () => {
            major.faculty.get().then(facultyRef => {
              const faculty = facultyRef.data() as Faculty;
              console.log(faculty);
              faculty.major = faculty.major === undefined ? new Array<DocumentReference>() : faculty.major;
              faculty.major.push(this.firestore.collection('Faculty').doc(major.major_name + facultyId).ref);
              this.facultyService.updateFaculty(facultyId, faculty);
            });
          });
      } else {
        throw new Error('มีสาขานี้อยู่ในระบบแล้ว');
      }
    });
  }
}
