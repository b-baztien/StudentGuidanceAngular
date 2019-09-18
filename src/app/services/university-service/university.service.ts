import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { University } from 'src/app/model/University';
import { Faculty } from 'src/app/model/Faculty';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  constructor(private firestore: AngularFirestore) {
  }

  ngOnInit() {
  }

  addUniversity(university: University) {
    university.location = new firestore.GeoPoint(18.7917493, 98.97431);
    console.log(university.location);
    console.log(university.location.latitude);
    console.log(university.location.longitude);
    const universityJSON = JSON.stringify(university);
    this.firestore.collection('University').doc(university.university_name).get().subscribe(result => {
      if (!result.exists) {
        return this.firestore.collection('University').doc(university.university_name).set(JSON.parse(universityJSON));
      } else {
        throw new Error('มีมหาวิทยาลัยนี้อยู่ในระบบแล้ว');
      }
    })
  }

  updateUniversity(university: University, faculty: Faculty) {
    return this.firestore.collection('University').doc(university.university_name)
      .collection('Faculty').doc(faculty.faculty_name).set(JSON.parse(JSON.stringify(faculty)));
  }

  getAllUniversity() {
    return this.firestore.collection('University').snapshotChanges();
  }

  getUniversity(university_id: string) {
    return this.firestore.collection('University').doc(university_id).snapshotChanges();
  }
}
