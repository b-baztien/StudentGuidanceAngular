import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { University } from 'src/app/model/University';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
  }

  ngOnInit() {
  }

  async addUniversity(university: University) {
    const universityId = this.firestore.createId();
    return await this.firestore.collection('University').ref.where('university_name', '==', university.university_name)
      .get().then(universityRes => {
        if (universityRes.empty) {
          this.firestore.collection('University').doc(universityId).set(Object.assign({}, university));
          return universityId;
        } else {
          throw new Error('มีข้อมูลมหาวิทยาลัยนี้อยู่ในระบบแล้ว');
        }
      })
  }

  updateUniversity(universityId: string, university: University) {
    return this.firestore.collection('University').doc(universityId).update(Object.assign({}, university));
  }

  deleteUniversity(universityId: string) {
    this.firestore.collection('University').doc(universityId).snapshotChanges().subscribe(result => {
      const university = result.payload.data() as University;
      if (undefined !== university.image) {
        this.afStorage.ref(university.image).delete();
      }
      if (undefined !== university.faculty) {
        university.faculty.forEach(fct => {
          this.firestore.collection('Faculty').doc(fct.id).delete();
        });
      }
      this.firestore.collection('University').doc(universityId).delete();
    });
  }

  getAllUniversity() {
    return this.firestore.collection('University').snapshotChanges();
  }

  getUniversity(university_id: string) {
    return this.firestore.collection('University').doc(university_id).snapshotChanges();
  }

  async getUniversityByUniversityName(university_name: string) {
    return await this.firestore.collection('University').ref.where('university_name', '==', university_name)
      .get().then(async result => {
        return await result.docs[0].exists ? result.docs[0].ref : null;
      });
  }
}
